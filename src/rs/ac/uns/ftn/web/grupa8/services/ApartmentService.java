package rs.ac.uns.ftn.web.grupa8.services;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Collection;
import java.util.Date;
import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.fasterxml.jackson.databind.JsonNode;

import rs.ac.uns.ftn.web.grupa8.beans.entities.Apartment;
import rs.ac.uns.ftn.web.grupa8.beans.entities.ApartmentComment;
import rs.ac.uns.ftn.web.grupa8.beans.entities.Reservation;
import rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy.Guest;
import rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy.User;
import rs.ac.uns.ftn.web.grupa8.dao.ApartmentDAO;
import rs.ac.uns.ftn.web.grupa8.dao.CommentDAO;
import rs.ac.uns.ftn.web.grupa8.dao.ReservationDAO;

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
		if (ctx.getAttribute("reservationDAO") == null) {
			String contextPath = ctx.getRealPath("/");
			ctx.setAttribute("reservationDAO", new ReservationDAO(contextPath));
		}
		if (ctx.getAttribute("commentDAO") == null) {
			String contextPath = ctx.getRealPath("/");
			ctx.setAttribute("commentDAO", new CommentDAO(contextPath));
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
	
	@GET
	@Path("/apartmentsActive")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Collection<Apartment> getAllActiveApartments() {
		ApartmentDAO apartmentDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		return apartmentDAO.getAllActive();
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
	@Path("/searchActiveApartments")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response searchActiveApartments(JsonNode obj) throws ServletException, IOException {
		long start = obj.get("startDate").asLong(0);
		Date startDate = null;
		if(start != 0) {
			startDate = new Date(start);
		}
		Date endDate = null;
		long end = obj.get("endDate").asLong(0);
		if(end != 0) {
			endDate = new Date(end);
		}
		String location = obj.get("location").asText("");
		location = location.trim();
		location = location.toLowerCase();
		double startPrice = obj.get("startPrice").asDouble(0);
		double endPrice = obj.get("endPrice").asDouble(0);
		int roomNumberFrom = obj.get("roomNumberFrom").asInt(0);
		int roomNumberTill = obj.get("roomNumberTill").asInt(0);
		int guestNumber = obj.get("guestNumber").asInt(0);
		System.out.println(startDate +"\n" + endDate + "\n" + location + "\n" +
				+ startPrice + "\n" + endPrice + "\n" + roomNumberFrom + "\n" + roomNumberTill + "\n"+ guestNumber);
		ApartmentDAO apartmentDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		Collection<Apartment> searched = apartmentDAO.searchActiveApartments(startDate, endDate, location, startPrice, endPrice, roomNumberFrom, roomNumberTill, guestNumber);
		if(searched.isEmpty()) {
			return Response.status(400).entity("Ne postoje apartmani koji zadovoljavaju kriterijume pretrage")
					.build();
		}
		return Response.ok(searched).status(200).build();
	}
	
	@GET
	@Path("/giveComment")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response giveComment(@QueryParam("comment") String comment, @QueryParam("grade") double grade, @QueryParam("apartment") int apartment, @Context HttpServletRequest request) throws ServletException, IOException {
		System.out.println("Komentar: " + comment + " ocena: " + grade + " apartman: " + apartment);
		ApartmentDAO apartmentDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		CommentDAO commentDAO = (CommentDAO) ctx.getAttribute("commentDAO");
		Apartment a = apartmentDAO.getById(apartment);
		HttpSession session = request.getSession();
		Guest g = (Guest) session.getAttribute("user");
		ApartmentComment apComment = new ApartmentComment();
		if (a == null)
			return Response.status(400).entity("Apartman za koji želite da ostavite komentar, ne postoji")
					.build();
		else {
			apComment.setApartment(a);
			apComment.setCommentText(comment);
			apComment.setGrade(grade);
			apComment.setGuest(g);
			commentDAO.add(apComment);
			return Response.status(200).build();
		}
	}

	@POST
	@Path("/imageUpload")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public void upload(@Context HttpServletRequest request, InputStream fileInputStream,
			@QueryParam("name") String name) throws Exception {
		String imageName = name;
		System.out.println(imageName);
		try {
			System.out.println(ctx.getRealPath(""));
			OutputStream outpuStream = new FileOutputStream(new File(ctx.getRealPath("/") + imageName));
			int read = 0;
			byte[] bytes = new byte[1024];
			while ((read = fileInputStream.read(bytes)) != -1) {
				outpuStream.write(bytes, 0, read);
			}
			outpuStream.flush();
			outpuStream.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@POST
	@Path("/setApartmentClicked")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response setApartmentClicked(Apartment a, @Context HttpServletRequest request)
			throws ServletException, IOException {
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

	@GET
	@Path("/reservationsByApartmentGuest")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Reservation> getReservationsByApartment(@QueryParam("id") int id, @Context HttpServletRequest request) throws ServletException, IOException {
		HttpSession session = request.getSession();
		User current = (User) session.getAttribute("user");
		ReservationDAO reservationDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		Collection<Reservation> retVal = reservationDAO.getByApartment(id, current.getUsername());
		return retVal;
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
