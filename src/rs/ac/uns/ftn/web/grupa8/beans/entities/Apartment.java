package rs.ac.uns.ftn.web.grupa8.beans.entities;

import java.io.Serializable;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import rs.ac.uns.ftn.web.grupa8.beans.enums.ApartmentStatus;
import rs.ac.uns.ftn.web.grupa8.beans.enums.ApartmentType;
import rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy.Host;

public class Apartment implements Serializable {
	@JsonIdentityInfo(generator=ObjectIdGenerators.IntSequenceGenerator.class,property="@id", scope = Apartment.class)
	private static final long serialVersionUID = 8539232035200018509L;
	private int id;
	private String name;
	private ApartmentType apartmentType;
	private int roomNumber;
	private int guestNumber;
	private Location location;
	private List<ApartmentRentDate> rentDates;
    @JsonIgnoreProperties(value = {"apartments"})
	private Host host;
    @JsonIgnoreProperties(value = {"apartment"})
	private List<ApartmentComment> comments;
	private List<String> imagePaths;
	private double priceByNight;
	private int checkInTime;
	private int checkOutTime;
	private ApartmentStatus apartmentStatus;
	private List<Amenities> amenities;
	@JsonIgnoreProperties(value = {"apartment"})
	private List<Reservation> reservations;
	private Boolean deleted;

	public Apartment() {
		super();
		this.deleted = false;
		rentDates = new ArrayList<ApartmentRentDate>();
		comments = new ArrayList<ApartmentComment>();
		imagePaths = new ArrayList<String>();
	}

	public Apartment(int id, ApartmentType apartmentType, int roomNumber, int guestNumber, Location location,
			List<ApartmentRentDate> rentDates, Host host, List<ApartmentComment> comments,
			List<String> imagePaths, double priceByNight, ApartmentStatus apartmentStatus, List<Amenities> amenities,
			List<Reservation> reservations, Boolean deleted, String name) {
		this(id, apartmentType, roomNumber, guestNumber, location, rentDates, host, comments,
				imagePaths, priceByNight, apartmentStatus, amenities, reservations, deleted, 14,
				10, name);
	}

	public Apartment(int id, ApartmentType apartmentType, int roomNumber, int guestNumber, Location location,
			List<ApartmentRentDate> rentDates, Host host, List<ApartmentComment> comments,
			List<String> imagePaths, double priceByNight, ApartmentStatus apartmentStatus, List<Amenities> amenities,
			List<Reservation> reservations, Boolean deleted, int checkInTime, int checkOutTime, String name) {
		this.id = id;
		this.apartmentType = apartmentType;
		this.roomNumber = roomNumber;
		this.guestNumber = guestNumber;
		this.location = location;
		this.rentDates = rentDates;
		this.host = host;
		this.comments = comments;
		this.imagePaths = imagePaths;
		this.priceByNight = priceByNight;
		this.checkInTime = checkInTime;
		this.checkOutTime = checkOutTime;
		this.apartmentStatus = apartmentStatus;
		this.amenities = amenities;
		this.reservations = reservations;
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Boolean getDeleted() {
		return deleted;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
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

	public List<ApartmentRentDate> getRentDates() {
		return rentDates;
	}

	public void setRentDates(List<ApartmentRentDate> rentDates) {
		this.rentDates = rentDates;
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

	public int getCheckInTime() {
		return checkInTime;
	}

	public void setCheckInTime(int checkInTime) {
		this.checkInTime = checkInTime;
	}

	public int getCheckOutTime() {
		return checkOutTime;
	}

	public void setCheckOutTime(int checkOutTime) {
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
