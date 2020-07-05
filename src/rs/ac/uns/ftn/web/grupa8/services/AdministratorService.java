package rs.ac.uns.ftn.web.grupa8.services;

import java.util.Collection; 

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import rs.ac.uns.ftn.web.grupa8.beans.entities.ApartmentComment;
import rs.ac.uns.ftn.web.grupa8.beans.entities.Reservation;
import rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy.User;
import rs.ac.uns.ftn.web.grupa8.dao.CommentDAO;
import rs.ac.uns.ftn.web.grupa8.dao.ReservationDAO;
import rs.ac.uns.ftn.web.grupa8.dao.UserDAO;

@Path("")
public class AdministratorService {
	
	@Context
	ServletContext ctx;

	public AdministratorService() {
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
	
	@GET
	@Path("/users")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<User> getAllUsers() {
		
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		return userDAO.getAll();
	}
	@GET
	@Path("/deleteuser")
	@Produces(MediaType.APPLICATION_JSON)
	public void deleteUser(@QueryParam("username") String username) {
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		User user = userDAO.getByUsername(username);
		userDAO.delete(user);
	}
	@GET
	@Path("/reservations")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Reservation> getallReservations() {
		
		ReservationDAO reservationDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		return reservationDAO.getAll();
	}
	@GET
	@Path("/comments")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<ApartmentComment> getAllComments() {
		System.out.println("Usao u komentare");
		CommentDAO commentDAO = (CommentDAO) ctx.getAttribute("commentDAO");
		return commentDAO.getAll();
	}
	

	
	
}
