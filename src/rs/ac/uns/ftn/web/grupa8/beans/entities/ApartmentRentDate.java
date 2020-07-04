package rs.ac.uns.ftn.web.grupa8.beans.entities;

import java.util.Date;

public class ApartmentRentDate {

	private Date date;
	private Boolean available;

	public ApartmentRentDate() {
		super();
	}

	public ApartmentRentDate(Date date, Boolean available) {
		super();
		this.date = date;
		this.available = available;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public Boolean getAvailable() {
		return available;
	}

	public void setAvailable(Boolean available) {
		this.available = available;
	}

}
