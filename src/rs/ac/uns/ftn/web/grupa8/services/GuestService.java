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
public class GuestService {

	
	@Context
	ServletContext ctx;

	public GuestService() {
		super();
	}

	@PostConstruct
	public void init() {
		if (ctx.getAttribute("userDAO") == null) {
			String contextPath = ctx.getRealPath("/");
			System.out.println(contextPath);
			ctx.setAttribute("userDAO", new UserDAO("C:\\Users\\Jovan\\Desktop"));
		}
		if (ctx.getAttribute("reservationDAO") == null) {
			String contextPath = ctx.getRealPath("/");
			System.out.println(contextPath);
			ctx.setAttribute("reservationDAO", new ReservationDAO("C:\\Users\\Jovan\\Desktop"));
		}
		if (ctx.getAttribute("commentDAO") == null) {
			String contextPath = ctx.getRealPath("/");
			System.out.println(contextPath);
			ctx.setAttribute("commentDAO", new CommentDAO("C:\\Users\\Jovan\\Desktop"));
		}
	}
	
	@POST
	@Path("/cancelReservation")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Collection<Reservation> cancelReservation(Reservation r) {			
		int id = r.getId();
		ReservationDAO reservationDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		 Reservation updateReservation = reservationDAO.getById(id);
		 updateReservation.setStatus(ReservationStatus.CANCELED);
		reservationDAO.update(updateReservation);
		 return reservationDAO.getAll();
	}
}
