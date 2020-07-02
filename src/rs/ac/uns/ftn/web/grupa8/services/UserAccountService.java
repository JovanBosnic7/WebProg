package rs.ac.uns.ftn.web.grupa8.services;

import java.io.IOException;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import rs.ac.uns.ftn.web.grupa8.beans.enums.AccountType;
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
			ctx.setAttribute("userDAO", new UserDAO(contextPath));
		}
	}

	@POST
	@Path("/register")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response RegisterUser(User user) throws ServletException, IOException {
		System.out.println("Usao u registraciju");
		System.out.println(user.getFirstname());
		UserDAO dao = (UserDAO) ctx.getAttribute("userDAO");
		if (!isUserValid(user)) {
			return Response.status(400).entity("Popunite sva polja za registraciju korisnika").build();
		}
		user.setAccountType(AccountType.GUEST);
		user.setDeleted(false);
		User forReg = dao.add(user);
		if (forReg == null)
			return Response.status(400).entity("Korisnik sa unetim korisničkim imenom već postoji").build();
		else {
			return Response.status(200).build();
		}
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
