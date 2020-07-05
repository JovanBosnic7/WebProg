package rs.ac.uns.ftn.web.grupa8.services;

import java.util.Collection; 

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import rs.ac.uns.ftn.web.grupa8.beans.entities.Apartment;
import rs.ac.uns.ftn.web.grupa8.beans.entities.ApartmentComment;
import rs.ac.uns.ftn.web.grupa8.beans.entities.Reservation;
import rs.ac.uns.ftn.web.grupa8.beans.enums.ReservationStatus;
import rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy.User;
import rs.ac.uns.ftn.web.grupa8.dao.ApartmentDAO;
import rs.ac.uns.ftn.web.grupa8.dao.CommentDAO;
import rs.ac.uns.ftn.web.grupa8.dao.ReservationDAO;
import rs.ac.uns.ftn.web.grupa8.dao.UserDAO;

@Path("")
public class HostService {

	
	@Context
	ServletContext ctx;

	public HostService() {
		super();
	}

	@PostConstruct
	public void init() {
		if (ctx.getAttribute("userDAO") == null) {
			String contextPath = ctx.getRealPath("/");
			System.out.println(contextPath);
			ctx.setAttribute("userDAO", new UserDAO(contextPath));
		}
		if (ctx.getAttribute("reservationDAO") == null) {
			String contextPath = ctx.getRealPath("/");
			System.out.println(contextPath);
			ctx.setAttribute("reservationDAO", new ReservationDAO(contextPath));
		}
		if (ctx.getAttribute("commentDAO") == null) {
			String contextPath = ctx.getRealPath("/");
			System.out.println(contextPath);
			ctx.setAttribute("commentDAO", new CommentDAO(contextPath));
		}
	}
	
	
	
	
	
	@POST
	@Path("/declineReservation")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Collection<Reservation> declineReservation(Reservation r) {	
		int id = r.getId();
		System.out.println(id);
		
		ReservationDAO reservationDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		 Reservation updateReservation = reservationDAO.getById(id);
		 updateReservation.setStatus(ReservationStatus.REFUSED);
		reservationDAO.update(updateReservation);
		 return reservationDAO.getAll();
	}
	@POST
	@Path("/acceptReservation")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Collection<Reservation> accepReservation(Reservation r) {	
		int id = r.getId();
		System.out.println(id);
		
		ReservationDAO reservationDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		 Reservation updateReservation = reservationDAO.getById(id);
		 updateReservation.setStatus(ReservationStatus.ACCEPTED);
		reservationDAO.update(updateReservation);
		 return reservationDAO.getAll();
	}
}
