package rs.ac.uns.ftn.web.grupa8.services;

import java.io.IOException;

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

import rs.ac.uns.ftn.web.grupa8.beans.enums.AccountType;
import rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy.Guest;
import rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy.User;
import rs.ac.uns.ftn.web.grupa8.dao.UserDAO;

@Path("")
public class UserAccountService {

	@Context
	ServletContext ctx;

	public UserAccountService() {
		super();
	}

	@PostConstruct
	public void init() {
		if (ctx.getAttribute("userDAO") == null) {
			String contextPath = ctx.getRealPath("/");
			System.out.println(contextPath);
			ctx.setAttribute("userDAO", new UserDAO(contextPath));
		}
	}

	@POST
	@Path("/register")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response RegisterUser(Guest user) throws ServletException, IOException {
		UserDAO dao = (UserDAO) ctx.getAttribute("userDAO");
		if (!isUserValid(user)) {
			return Response.status(400).entity("Popunite sva polja za registraciju korisnika").build();
		}
		user.setAccountType(AccountType.GUEST);
		user.setDeleted(false);
		Guest forReg = (Guest) dao.add(user);
		if (forReg == null)
			return Response.status(400).entity("Korisnik sa unetim korisničkim imenom već postoji").build();
		else {
			return Response.ok(forReg).status(200).build();
		}
	}
	
	@GET
	@Path("/currentUser")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public User getCurrentUser(@Context HttpServletRequest request) throws ServletException, IOException {
		HttpSession session = request.getSession();
		User retVal = (User) session.getAttribute("user");
		if (retVal == null) {
			return null;
		}
		return retVal;
	}
	
	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response login(User user, @Context HttpServletRequest request) {
		HttpSession session = request.getSession();
		if (session.getAttribute("user") != null) {
			return Response.status(400).entity("Već ste prijavljeni").build();
		}

		if (!areCredentialsValid(user)) {
			return Response.status(400).entity("Korisničko ime i/ili lozinka nisu validni").build();
		}
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		User forLogin = (User) userDAO.getByUsername(user.getUsername());
		session.setAttribute("user", forLogin);
		return Response.ok(forLogin).status(200).build();

	}

	@POST
	@Path("/logout")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public void logout(@Context HttpServletRequest request) {
		request.getSession().invalidate();
	}
	
	private Boolean areCredentialsValid(User user) {
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		User toCheck = userDAO.getByUsername(user.getUsername());
		if (toCheck == null)
			return false;
		if (!toCheck.getPassword().equals(user.getPassword()))
			return false;

		return true;
	}

	private Boolean isUserValid(User user) {
		if (user.getFirstname().trim().equals(""))
			return false;
		if (user.getLastname().trim().equals(""))
			return false;
		if (user.getPassword().trim().equals(""))
			return false;
		if (user.getUsername().trim().equals(""))
			return false;

		return true;
	}

}
