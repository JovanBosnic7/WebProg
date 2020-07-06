package rs.ac.uns.ftn.web.grupa8.services;

import java.io.IOException;
import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import rs.ac.uns.ftn.web.grupa8.beans.entities.Apartment;
import rs.ac.uns.ftn.web.grupa8.beans.entities.Reservation;
import rs.ac.uns.ftn.web.grupa8.beans.enums.ReservationStatus;
import rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy.Guest;
import rs.ac.uns.ftn.web.grupa8.dao.ReservationDAO;

@Path("")
public class ReservationService {

	@Context
	ServletContext ctx;

	public ReservationService() {
		super();
	}

	@PostConstruct
	public void init() {
		if (ctx.getAttribute("reservationDAO") == null) {
			String contextPath = ctx.getRealPath("/");
			ctx.setAttribute("reservationDAO", new ReservationDAO(contextPath));
		}
	}
	
	@GET
	@Path("/reservationsGuest")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Reservation> getallGuestReservations(@Context HttpServletRequest request) throws ServletException, IOException{
		HttpSession session = request.getSession();
		Guest g = (Guest) session.getAttribute("user");
		ReservationDAO reservationDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		return reservationDAO.getAllByGuest(g.getUsername());
	}
	
	@POST
	@Path("/createReservation")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createReservation(Reservation reservation, @Context HttpServletRequest request) throws ServletException, IOException {
		ReservationDAO dao = (ReservationDAO) ctx.getAttribute("reservationDAO");
		HttpSession session = request.getSession();
		Apartment a = (Apartment) session.getAttribute("apartmentClicked");
		Guest u = (Guest) session.getAttribute("user");
		reservation.setApartment(a);
		reservation.setGuest(u);
		if (!isReservationValid(reservation)) {
			return Response.status(400).entity("Popunite sva polja za kreiranje rezervacije").build();
		}
		
		reservation.setStatus(ReservationStatus.CREATED);
		reservation.setDeleted(false);
		Reservation forReg = (Reservation) dao.add(reservation);
		if (forReg == null)
			return Response.status(400).entity("Kreiranje rezervacije nije uspelo").build();
		else {
			return Response.status(200).build();
		}
	}
	
	private Boolean isReservationValid(Reservation reservation) {
		return (reservation.getGuest() != null) && (reservation.getStartDate() != null) 
				&& (reservation.getApartment() != null) && (reservation.getNightsNumber() > 0);
	}
	
}
