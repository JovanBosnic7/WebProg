
import java.util.ArrayList;

import rs.ac.uns.ftn.web.grupa8.beans.entities.Address;
import rs.ac.uns.ftn.web.grupa8.beans.entities.Apartment;
import rs.ac.uns.ftn.web.grupa8.beans.entities.Location;
import rs.ac.uns.ftn.web.grupa8.beans.enums.ApartmentStatus;
import rs.ac.uns.ftn.web.grupa8.beans.enums.ApartmentType;
import rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy.Host;
import rs.ac.uns.ftn.web.grupa8.dao.ApartmentDAO;

public class Test {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		Apartment a = new Apartment();
		a.setId(1);
		a.setApartmentType(ApartmentType.ROOM);
		a.setRoomNumber(2);
		a.setGuestNumber(4);
		a.setPriceByNight(5000.00);
		Address address = new Address("Bulevar Oslobodjenja 12","Novi Sad", 21000);
		Location location = new Location(44.12345,55.12345,address);
		a.setLocation(location);
		Host h = new Host();
		h.setFirstname("Aca");
		h.setLastname("Simic");
		a.setHost(h);
		ArrayList<String> images = new ArrayList<String>();
		images.add("apartment1.jpg");
		a.setImagePaths(images);
		a.setDeleted(false);
		a.setApartmentStatus(ApartmentStatus.ACTIVE);
		ApartmentDAO apartmentDAO = new ApartmentDAO("C:\\Users\\Jovan\\Desktop");
		//apartmentDAO.add(a);
		
		
		
	}

}
