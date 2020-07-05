package rs.ac.uns.ftn.web.grupa8.services;

import java.io.IOException;
import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import rs.ac.uns.ftn.web.grupa8.beans.entities.Amenities;
import rs.ac.uns.ftn.web.grupa8.dao.AmenitiesDAO;
import rs.ac.uns.ftn.web.grupa8.dao.ApartmentDAO;

@Path("")
public class AmenitiesService {
	@Context
	ServletContext ctx;

	public AmenitiesService() {
		super();
	}

	@PostConstruct
	public void init() {
		if (ctx.getAttribute("amenitiesDAO") == null) {
			String contextPath = ctx.getRealPath("/");
			ctx.setAttribute("amenitiesDAO", new AmenitiesDAO(contextPath));
		}
		if (ctx.getAttribute("apartmentDAO") == null) {
			String contextPath = ctx.getRealPath("/");
			ctx.setAttribute("apartmentDAO", new ApartmentDAO(contextPath));
		}
	}

	@GET
	@Path("/amenities")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Amenities> getAllAmenities() {
		AmenitiesDAO amenitiesDAO = (AmenitiesDAO) ctx.getAttribute("amenitiesDAO");
		return amenitiesDAO.getAll();
	}

	@POST
	@Path("/addAmenities")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response addAmenities(Amenities amenities) throws ServletException, IOException {
		AmenitiesDAO dao = (AmenitiesDAO) ctx.getAttribute("amenitiesDAO");
		if (!areAmenitiesValid(amenities)) {
			return Response.status(400).entity("Popunite sva polja za dodavanje stavke").build();
		}
		amenities.setDeleted(false);
		Amenities forReg = (Amenities) dao.add(amenities);
		if (forReg == null)
			return Response.status(400).entity("Dodavanje stavke nije uspelo").build();
		else {
			return Response.status(200).build();
		}
	}

	private Boolean areAmenitiesValid(Amenities amenities) {
		if (amenities.getName().trim().equals("")) {
			return false;
		}
		if (amenities.getDescription().trim().equals("")) {
			return false;
		}
		return true;
	}
	
	@GET
	@Path("/amenitiesById")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response getById(@QueryParam("id") int id) throws ServletException, IOException {
		AmenitiesDAO amenitiesDAO = (AmenitiesDAO) ctx.getAttribute("amenitiesDAO");
		Amenities retVal = (Amenities) amenitiesDAO.getById(id);
		if (retVal == null)
			return Response.status(400).entity("Stavka apartmana ne postoji ili je izbrisana")
					.build();
		else {
			return Response.ok(retVal).status(200).build();
		}
	}
	
	@PUT
	@Path("/editAmenities")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response editAmenities(Amenities amenities) throws ServletException, IOException {
		AmenitiesDAO amenitiesDAO = (AmenitiesDAO) ctx.getAttribute("amenitiesDAO");
		Amenities forEdit = (Amenities) amenitiesDAO.getById(amenities.getId());
		if (forEdit == null)
			return Response.status(400).entity("Stavka apartmana koju želite da izmenite ne postoji ili je izbrisana")
					.build();
		else {
			amenitiesDAO.update(amenities);
			return Response.status(200).build();
		}

	}

	@DELETE
	@Path("/deleteAmenities")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteAmenities(Amenities amenities) throws ServletException, IOException {
		AmenitiesDAO amenitiesDAO = (AmenitiesDAO) ctx.getAttribute("amenitiesDAO");
		ApartmentDAO apartmentDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		Amenities forDelete = (Amenities) amenitiesDAO.getById(amenities.getId());
		if (forDelete == null)
			return Response.status(400)
					.entity("Stavka apartmana koju želite da obrišete ne postoji ili je već izbrisana").build();
		else {
			if (amenitiesDAO.delete(forDelete)) {
				apartmentDAO.removeAmenities(forDelete);
				return Response.status(200).build();
			}
			return Response.status(500).entity("Došlo je do interne serverske greške pri brisanju").build();
		}

	}

}
