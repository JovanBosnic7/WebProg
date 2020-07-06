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
	
	@GET
	@Path("/commentsByUser")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<ApartmentComment> getAllUserComments(@Context HttpServletRequest request) throws ServletException, IOException {
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		CommentDAO commentDAO = (CommentDAO) ctx.getAttribute("commentDAO");
		return commentDAO.getAllByUser(user.getUsername());
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
