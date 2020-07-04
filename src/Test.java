
import java.util.ArrayList;
import java.util.Date;

import rs.ac.uns.ftn.web.grupa8.beans.entities.Address;
import rs.ac.uns.ftn.web.grupa8.beans.entities.Apartment;
import rs.ac.uns.ftn.web.grupa8.beans.entities.ApartmentComment;
import rs.ac.uns.ftn.web.grupa8.beans.entities.Location;
import rs.ac.uns.ftn.web.grupa8.beans.entities.Reservation;
import rs.ac.uns.ftn.web.grupa8.beans.enums.AccountType;
import rs.ac.uns.ftn.web.grupa8.beans.enums.ApartmentStatus;
import rs.ac.uns.ftn.web.grupa8.beans.enums.ApartmentType;
import rs.ac.uns.ftn.web.grupa8.beans.enums.Gender;
import rs.ac.uns.ftn.web.grupa8.beans.enums.ReservationStatus;
import rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy.Guest;
import rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy.Host;
import rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy.User;
import rs.ac.uns.ftn.web.grupa8.dao.ApartmentDAO;
import rs.ac.uns.ftn.web.grupa8.dao.CommentDAO;
import rs.ac.uns.ftn.web.grupa8.dao.ReservationDAO;
import rs.ac.uns.ftn.web.grupa8.dao.UserDAO;

public class Test {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		Apartment a = new Apartment();
		a.setId(1);
		a.setApartmentType(ApartmentType.ROOM);
		a.setRoomNumber(2);
		a.setGuestNumber(4);
		a.setName("Apartman 1");
		a.setPriceByNight(5000.00);
		Address address = new Address("Bulevar Oslobodjenja 12","Novi Sad", 21000);
		Location location = new Location(44.12345,55.12345,address);
		a.setLocation(location);
		Host h = new Host();
		h.setFirstname("Aca");
		h.setLastname("Simic");
		
		
		ArrayList<String> images = new ArrayList<String>();
		images.add("apartment1.jpg");
		a.setImagePaths(images);
		a.setDeleted(false);
		a.setApartmentStatus(ApartmentStatus.ACTIVE);
		ApartmentDAO apartmentDAO = new ApartmentDAO("C:\\\\Users\\\\Jovan\\\\Desktop\\\\WEBProjekat\\\\WebProg\\\\WebContent");
		//apartmentDAO.add(a);
		
		User u = new User();
		u.setId(1);
		u.setUsername("Aco123");
		u.setPassword("acoaco123");
		u.setFirstname("Aca");
		u.setLastname("Simic");
		u.setGender(Gender.MALE);
		u.setAccountType(AccountType.GUEST);
		u.setDeleted(false);
		UserDAO userDAO = new UserDAO("C:\\Users\\Jovan\\Desktop\\WEBProjekat\\WebProg\\WebContent");
		Guest g = new Guest();
		g.setFirstname("Aca");
		g.setLastname("Simic");
		//userDAO.add(u);
		Host jovanUser = (Host) userDAO.getByUsername("jovan123");
		a.setHost(jovanUser);
		ArrayList<Apartment> apartmani = new ArrayList<Apartment>();
		apartmani.add(a);
		jovanUser.setApartments(apartmani);
		//apartmentDAO.update(a);
		//userDAO.update(jovanUser);
		
		Guest aleksa255 = (Guest) userDAO.getByUsername("aleksa255");
		aleksa255.setApartments(apartmani);
		//userDAO.update(aleksa255);
		
		Reservation r = new Reservation();
		r.setId(1);
		r.setApartment(a);
		r.setDeleted(false);
		r.setGuest(g);
		r.setNightsNumber(4);
		r.setTotalPrice(r.getNightsNumber()*a.getPriceByNight());
		r.setStatus(ReservationStatus.ACCEPTED);
		@SuppressWarnings("deprecation")
		Date startDate = new Date(2020,07,20);
		r.setStartDate(startDate);
		r.setGuest(aleksa255);
		ReservationDAO reservationDAO = new ReservationDAO("C:\\Users\\Jovan\\Desktop");
		//reservationDAO.add(r);
		//reservationDAO.update(r);
		
		
		
		ApartmentComment apc = new ApartmentComment();
		apc.setId(1);
		apc.setApartment(a);
		apc.setCommentText("Vrlo lepo ");
		apc.setGrade(8.0);
		apc.setGuest(g);
		CommentDAO commentDAO = new CommentDAO("C:\\Users\\Jovan\\Desktop");
		apc.setDeleted(false);
		commentDAO.update(apc);
	}
	

}
