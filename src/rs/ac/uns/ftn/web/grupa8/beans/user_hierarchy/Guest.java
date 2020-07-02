package rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import rs.ac.uns.ftn.web.grupa8.beans.entities.Apartment;
import rs.ac.uns.ftn.web.grupa8.beans.entities.Reservation;
import rs.ac.uns.ftn.web.grupa8.beans.enums.AccountType;
import rs.ac.uns.ftn.web.grupa8.beans.enums.Gender;

public class Guest extends User {

	private static final long serialVersionUID = -257435521795022059L;
	List<Apartment> apartments;
    @JsonIgnoreProperties(value = {"guest"})
	List<Reservation> reservations;

	public Guest() {
		super();
		apartments = new ArrayList<Apartment>();
		reservations = new ArrayList<Reservation>();
	}

	public Guest(int id, String username, String password, String firstname, String lastname, Gender gender, Boolean deleted,
			List<Apartment> apartments, List<Reservation> reservations) {
		super(id, username, password, firstname, lastname, gender, AccountType.GUEST, deleted);
		this.apartments = apartments;
		this.reservations = reservations;
	}

	public List<Apartment> getApartments() {
		return apartments;
	}

	public void setApartments(List<Apartment> apartments) {
		this.apartments = apartments;
	}

	public List<Reservation> getReservations() {
		return reservations;
	}

	public void setReservations(List<Reservation> reservations) {
		this.reservations = reservations;
	}

}
