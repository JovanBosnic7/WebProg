package rs.ac.uns.ftn.web.grupa8.beans.entities;

import java.io.Serializable;

import rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy.Guest;

public class ApartmentComment implements Serializable {

	private static final long serialVersionUID = 8403653528635877869L;
	private Guest guest;
	private Apartment apartment;
	private String commentText;
	private double grade;
	private Boolean deleted;

	public ApartmentComment() {
		super();
	}

	public ApartmentComment(Guest guest, Apartment apartment, String commentText, double grade, Boolean deleted) {
		this.guest = guest;
		this.apartment = apartment;
		this.commentText = commentText;
		this.grade = grade;
		this.deleted = deleted;
	}

	public Guest getGuest() {
		return guest;
	}

	public void setGuest(Guest guest) {
		this.guest = guest;
	}

	public Apartment getApartment() {
		return apartment;
	}

	public void setApartment(Apartment apartment) {
		this.apartment = apartment;
	}

	public String getCommentText() {
		return commentText;
	}

	public void setCommentText(String commentText) {
		this.commentText = commentText;
	}

	public double getGrade() {
		return grade;
	}

	public void setGrade(double grade) {
		this.grade = grade;
	}

	public Boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
	}

}
