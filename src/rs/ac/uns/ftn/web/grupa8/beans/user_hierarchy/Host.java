package rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy;

import java.util.ArrayList;
import java.util.List;

import rs.ac.uns.ftn.web.grupa8.beans.entities.*;
import rs.ac.uns.ftn.web.grupa8.beans.enums.AccountType;
import rs.ac.uns.ftn.web.grupa8.beans.enums.Gender;

public class Host extends User {

	private static final long serialVersionUID = -5541749480701077181L;
	List<Apartment> apartments;

	public Host() {
		super();
		apartments = new ArrayList<Apartment>();
	}

	public Host(int id, String username, String password, String firstname, String lastname, Gender gender, Boolean deleted,
			List<Apartment> apartments) {
		super(id, username, password, firstname, lastname, gender, AccountType.HOST, deleted);
		this.apartments = apartments;
	}

	public List<Apartment> getApartments() {
		return apartments;
	}

	public void setApartments(List<Apartment> apartments) {
		this.apartments = apartments;
	}

}
