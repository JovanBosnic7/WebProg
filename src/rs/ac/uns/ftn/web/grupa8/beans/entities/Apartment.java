package rs.ac.uns.ftn.web.grupa8.beans.entities;

import java.io.Serializable;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import rs.ac.uns.ftn.web.grupa8.beans.enums.ApartmentStatus;
import rs.ac.uns.ftn.web.grupa8.beans.enums.ApartmentType;
import rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy.Host;

public class Apartment implements Serializable {

	private static final long serialVersionUID = 8539232035200018509L;
	private ApartmentType apartmentType;
	private int roomNumber;
	private int guestNumber;
	private Location location;
	private List<Date> rentDates;
	private HashMap<Date, Boolean> availabilityByDate;
	private Host host;
	private List<ApartmentComment> comments;
	private List<String> imagePaths;
	private double priceByNight;
	private LocalTime checkInTime;
	private LocalTime checkOutTime;
	private ApartmentStatus apartmentStatus;
	private List<Amenities> amenities;
	private List<Reservation> reservations;
	private Boolean deleted;
	
	public Apartment() {
		super();
		rentDates = new ArrayList<Date>();
		availabilityByDate = new HashMap<Date, Boolean>();
		comments = new ArrayList<ApartmentComment>();
		imagePaths = new ArrayList<String>();
	}
	
	public Apartment(ApartmentType apartmentType, int roomNumber, int guestNumber, Location location,
			List<Date> rentDates, HashMap<Date, Boolean> availabilityByDate, Host host, List<ApartmentComment> comments,
			List<String> imagePaths, double priceByNight, ApartmentStatus apartmentStatus, List<Amenities> amenities, 
			List<Reservation> reservations, Boolean deleted) {
		this(apartmentType, roomNumber, guestNumber, location, rentDates, availabilityByDate, host, comments, imagePaths, priceByNight, apartmentStatus, amenities, reservations, deleted, LocalTime.of(14, 0), LocalTime.of(10, 0));
	}

	public Apartment(ApartmentType apartmentType, int roomNumber, int guestNumber, Location location,
			List<Date> rentDates, HashMap<Date, Boolean> availabilityByDate, Host host, List<ApartmentComment> comments,
			List<String> imagePaths, double priceByNight, ApartmentStatus apartmentStatus, List<Amenities> amenities, 
			List<Reservation> reservations, Boolean deleted, LocalTime checkInTime, LocalTime checkOutTime) {
		this.apartmentType = apartmentType;
		this.roomNumber = roomNumber;
		this.guestNumber = guestNumber;
		this.location = location;
		this.rentDates = rentDates;
		this.availabilityByDate = availabilityByDate;
		this.host = host;
		this.comments = comments;
		this.imagePaths = imagePaths;
		this.priceByNight = priceByNight;
		this.checkInTime = checkInTime;
		this.checkOutTime = checkOutTime;
		this.apartmentStatus = apartmentStatus;
		this.amenities = amenities;
		this.reservations = reservations;
	}

	public ApartmentType getApartmentType() {
		return apartmentType;
	}

	public void setApartmentType(ApartmentType apartmentType) {
		this.apartmentType = apartmentType;
	}

	public int getRoomNumber() {
		return roomNumber;
	}

	public void setRoomNumber(int roomNumber) {
		this.roomNumber = roomNumber;
	}

	public int getGuestNumber() {
		return guestNumber;
	}

	public void setGuestNumber(int guestNumber) {
		this.guestNumber = guestNumber;
	}

	public Location getLocation() {
		return location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

	public List<Date> getRentDates() {
		return rentDates;
	}

	public void setRentDates(List<Date> rentDates) {
		this.rentDates = rentDates;
	}

	public HashMap<Date, Boolean> getAvailabilityByDate() {
		return availabilityByDate;
	}

	public void setAvailabilityByDate(HashMap<Date, Boolean> availabilityByDate) {
		this.availabilityByDate = availabilityByDate;
	}

	public Host getHost() {
		return host;
	}

	public void setHost(Host host) {
		this.host = host;
	}

	public List<ApartmentComment> getComments() {
		return comments;
	}

	public void setComments(List<ApartmentComment> comments) {
		this.comments = comments;
	}

	public List<String> getImagePaths() {
		return imagePaths;
	}

	public void setImagePaths(List<String> imagePaths) {
		this.imagePaths = imagePaths;
	}

	public double getPriceByNight() {
		return priceByNight;
	}

	public void setPriceByNight(double priceByNight) {
		this.priceByNight = priceByNight;
	}

	public LocalTime getCheckInTime() {
		return checkInTime;
	}

	public void setCheckInTime(LocalTime checkInTime) {
		this.checkInTime = checkInTime;
	}

	public LocalTime getCheckOutTime() {
		return checkOutTime;
	}

	public void setCheckOutTime(LocalTime checkOutTime) {
		this.checkOutTime = checkOutTime;
	}

	public ApartmentStatus getApartmentStatus() {
		return apartmentStatus;
	}

	public void setApartmentStatus(ApartmentStatus apartmentStatus) {
		this.apartmentStatus = apartmentStatus;
	}

	public List<Amenities> getAmenities() {
		return amenities;
	}

	public void setAmenities(List<Amenities> amenities) {
		this.amenities = amenities;
	}

	public List<Reservation> getReservations() {
		return reservations;
	}

	public void setReservations(List<Reservation> reservations) {
		this.reservations = reservations;
	}

	public Boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
	}

}
