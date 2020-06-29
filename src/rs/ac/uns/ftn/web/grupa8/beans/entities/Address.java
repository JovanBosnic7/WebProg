package rs.ac.uns.ftn.web.grupa8.beans.entities;

import java.io.Serializable;

public class Address implements Serializable {

	private static final long serialVersionUID = -3570003297688728708L;
	private String street;
	private String city;
	private int zipCode;

	public Address() {
		super();
	}

	public Address(String street, String city, int zipCode) {
		this.street = street;
		this.city = city;
		this.zipCode = zipCode;
	}

	public String getStreet() {
		return street;
	}

	public void setStreet(String street) {
		this.street = street;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public int getZipCode() {
		return zipCode;
	}

	public void setZipCode(int zipCode) {
		this.zipCode = zipCode;
	}

}
