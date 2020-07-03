package rs.ac.uns.ftn.web.grupa8.beans.entities;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy.Guest;

public class ApartmentComment implements Serializable {
	@JsonIdentityInfo(generator=ObjectIdGenerators.IntSequenceGenerator.class,property="@id", scope = ApartmentComment.class)
	private static final long serialVersionUID = 8403653528635877869L;
	private int id;
	private Guest guest;
	@JsonIgnoreProperties(value = {"comments"})
	private Apartment apartment;
	private String commentText;
	private double grade;
	private Boolean deleted;

	public ApartmentComment() {
		super();
		this.deleted = false;
	}

	public ApartmentComment(int id, Guest guest, Apartment apartment, String commentText, double grade,
			Boolean deleted) {
		this.id = id;
		this.guest = guest;
		this.apartment = apartment;
		this.commentText = commentText;
		this.grade = grade;
		this.deleted = deleted;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
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
