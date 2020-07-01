package rs.ac.uns.ftn.web.grupa8.beans.entities;

import java.io.Serializable;
import java.util.Date;

import rs.ac.uns.ftn.web.grupa8.beans.enums.ReservationStatus;
import rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy.Guest;

public class Reservation implements Serializable {

	private static final long serialVersionUID = 6649753648984634510L;
	private int id;
	private Apartment apartment;
	private Date startDate;
	private int nightsNumber;
	private double totalPrice;
	private String reservationMessage;
	private Guest guest;
	private ReservationStatus status;
	private Boolean deleted;

	public Reservation() {
		super();
	}

	public Reservation(int id, Apartment apartment, Date startDate, double totalPrice, String reservationMessage,
			Guest guest, ReservationStatus status, Boolean deleted) {
		this(id, apartment, startDate, totalPrice, reservationMessage, guest, status, deleted, 1);
	}

	public Reservation(int id, Apartment apartment, Date startDate, double totalPrice, String reservationMessage,
			Guest guest, ReservationStatus status, Boolean deleted, int nightsNumber) {
		this.id = id;
		this.apartment = apartment;
		this.startDate = startDate;
		this.nightsNumber = nightsNumber;
		this.totalPrice = totalPrice;
		this.reservationMessage = reservationMessage;
		this.guest = guest;
		this.status = status;
		this.deleted = deleted;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Apartment getApartment() {
		return apartment;
	}

	public void setApartment(Apartment apartment) {
		this.apartment = apartment;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public int getNightsNumber() {
		return nightsNumber;
	}

	public void setNightsNumber(int nightsNumber) {
		this.nightsNumber = nightsNumber;
	}

	public double getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(double totalPrice) {
		this.totalPrice = totalPrice;
	}

	public String getReservationMessage() {
		return reservationMessage;
	}

	public void setReservationMessage(String reservationMessage) {
		this.reservationMessage = reservationMessage;
	}

	public Guest getGuest() {
		return guest;
	}

	public void setGuest(Guest guest) {
		this.guest = guest;
	}

	public ReservationStatus getStatus() {
		return status;
	}

	public void setStatus(ReservationStatus status) {
		this.status = status;
	}

	public Boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
	}

}
