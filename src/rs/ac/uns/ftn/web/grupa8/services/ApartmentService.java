package rs.ac.uns.ftn.web.grupa8.services;

import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import rs.ac.uns.ftn.web.grupa8.beans.entities.Apartment;
import rs.ac.uns.ftn.web.grupa8.dao.ApartmentDAO;

@Path("")
public class ApartmentService {
	@Context
	ServletContext ctx;

	public ApartmentService() {
		super();
	}

	@PostConstruct
	public void init() {
		if (ctx.getAttribute("apartmentDAO") == null) {
			String contextPath = ctx.getRealPath("/");
			System.out.println(contextPath);
			ctx.setAttribute("apartmentDAO", new ApartmentDAO("C:\\Users\\Jovan\\Desktop"));
		}
	}
	
	@GET
	@Path("/apartments")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Apartment> getAllApartments() {
		ApartmentDAO apartmentDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		return apartmentDAO.getAll();
	}
	
}
