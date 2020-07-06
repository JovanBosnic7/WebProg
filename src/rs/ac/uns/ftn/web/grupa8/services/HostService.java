package rs.ac.uns.ftn.web.grupa8.services;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;

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
import rs.ac.uns.ftn.web.grupa8.beans.enums.Gender;
import rs.ac.uns.ftn.web.grupa8.beans.enums.ReservationStatus;
import rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy.Guest;
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

		ReservationDAO reservationDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		Reservation updateReservation = reservationDAO.getById(id);
		updateReservation.setStatus(ReservationStatus.ACCEPTED);
		reservationDAO.update(updateReservation);
		return reservationDAO.getAll();
	}

	@GET
	@Path("/searchUsers")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Collection<Guest> searchUsers(@QueryParam("gender") Gender gen,
			@QueryParam("username") String un, @QueryParam("hostid") int hostid) {
		ArrayList<Guest> users = new ArrayList<Guest>();
		
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		ReservationDAO reservationDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		Collection<Reservation> reservations = reservationDAO.getByHost(hostid);
		HashMap<String, Guest> guests = new HashMap<String, Guest>();
		for (Reservation res : reservations) {
			Guest user = res.getGuest();
			if (!guests.containsKey(user.getUsername())) {
				guests.put(user.getUsername(), user);
			}
		}
		for (Guest g : guests.values()) {
			if (g.getGender() == gen && g.getUsername().contains(un)) {
				users.add(g);
			}
		}
			return users;
	}
	@GET
	@Path("/addUsersHost")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Collection<Guest> getUsersHost(@QueryParam("hostid") int hostid) {
		ArrayList<Guest> users = new ArrayList<Guest>();
		
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		ReservationDAO reservationDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		Collection<Reservation> reservations = reservationDAO.getByHost(hostid);
		HashMap<String, Guest> guests = new HashMap<String, Guest>();
		for (Reservation res : reservations) {
			Guest user = res.getGuest();
			if (!guests.containsKey(user.getUsername())) {
				guests.put(user.getUsername(), user);
			}
		}
		for (Guest g : guests.values()) {
			
				users.add(g);
			}
		
			return users;
	}
	@POST
	@Path("/addComment")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Collection<ApartmentComment> addComment(ApartmentComment apart) {
		int id = apart.getId();
		CommentDAO commentDAO = (CommentDAO) ctx.getAttribute("commentDAO");
		ApartmentComment comment = commentDAO.getById(id);
		comment.setVisible(true);
		commentDAO.update(comment);
		
		return commentDAO.getAll();
	}
	@POST
	@Path("/removeComment")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Collection<ApartmentComment> removeComment(ApartmentComment apart) {
		int id = apart.getId();
		CommentDAO commentDAO = (CommentDAO) ctx.getAttribute("commentDAO");
		ApartmentComment comment = commentDAO.getById(id);
		comment.setVisible(false);
		commentDAO.update(comment);
		
		return commentDAO.getAll();
	}
}
