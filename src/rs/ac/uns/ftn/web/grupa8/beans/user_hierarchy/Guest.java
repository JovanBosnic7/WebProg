package rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy;

import java.util.ArrayList;
import java.util.List;

import rs.ac.uns.ftn.web.grupa8.beans.entities.*;
import rs.ac.uns.ftn.web.grupa8.beans.enums.AccountType;
import rs.ac.uns.ftn.web.grupa8.beans.enums.Gender;

public class Guest extends User {

	private static final long serialVersionUID = -257435521795022059L;
	List<Apartment> apartments;
	List<Reservation> reservations;

	public Guest() {
		super();
		apartments = new ArrayList<Apartment>();
		reservations = new ArrayList<Reservation>();
	}

	public Guest(String username, String password, String firstname, String lastname, Gender gender, Boolean deleted,
			List<Apartment> apartments, List<Reservation> reservations) {
		super(username, password, firstname, lastname, gender, AccountType.GUEST, deleted);
		this.apartments = apartments;
		this.reservations = reservations;
	}

}
