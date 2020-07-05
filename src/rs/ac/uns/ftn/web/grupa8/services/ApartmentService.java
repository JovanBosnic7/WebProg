package rs.ac.uns.ftn.web.grupa8.services;

import java.io.IOException;
import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.websocket.server.PathParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

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
			ctx.setAttribute("apartmentDAO", new ApartmentDAO(contextPath));
		}
	}
	
	@GET
	@Path("/apartments")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Collection<Apartment> getAllApartments() {
		ApartmentDAO apartmentDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		return apartmentDAO.getAll();
	}
	
	@POST
	@Path("/addApartment")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Collection<Apartment> addApartment(Apartment a) {
		ApartmentDAO apartmentDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		 apartmentDAO.add(a);
		 return apartmentDAO.getAll();
	}
	
	@POST
	@Path("/setApartmentClicked")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response setApartmentClicked(Apartment a, @Context HttpServletRequest request) throws ServletException, IOException {
		HttpSession session = request.getSession();
		ApartmentDAO apartmentDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		Apartment test = apartmentDAO.getById(a.getId());
		if (test == null) {
			return Response.status(400).entity("Apartman koji ste odabrali ne postoji u sistemu").build();
		}
		session.setAttribute("apartmentClicked", test);
		return Response.status(200).build();
	}
	
	@GET
	@Path("/getApartmentClicked")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getApartmentClicked(@Context HttpServletRequest request) throws ServletException, IOException {
		HttpSession session = request.getSession();
		Apartment test = (Apartment) session.getAttribute("apartmentClicked");
		if (test == null) {
			return Response.status(400).entity("Niste odabrali apartman").build();
		}
		session.removeAttribute("apartmentClicked");
		return Response.ok(test).status(200).build();
	}
	
	@POST
	@Path("/deleteApartment")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Collection<Apartment> deleteApartment(Apartment apart) {
		int id = apart.getId();
		ApartmentDAO apartmentDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		Apartment a = apartmentDAO.getById(id);
		 apartmentDAO.delete(a);
		 return apartmentDAO.getAll();
	}
	@POST
	@Path("/editApartment")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Apartment editApartment(Apartment apart) {
		int id = apart.getId();
		ApartmentDAO apartmentDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		Apartment a = apartmentDAO.getById(id); 
		 return a;
	}
	@POST
	@Path("/updateApartment")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Collection<Apartment> updateApartment(Apartment a) {	
		ApartmentDAO apartmentDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		 apartmentDAO.update(a);
		 return apartmentDAO.getAll();
	}
	
}
