package rs.ac.uns.ftn.web.grupa8.beans.entities;

import java.io.Serializable;

import rs.ac.uns.ftn.web.grupa8.beans.enums.AmenitiesCategory;

public class Amenities implements Serializable {

	private static final long serialVersionUID = -4984256778608375468L;
	private int id;
	private String name;
	private String description;
	private AmenitiesCategory category;

	public Amenities() {
		super();
	}

	public Amenities(int id, String name, String description, AmenitiesCategory category) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.category = category;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public AmenitiesCategory getCategory() {
		return category;
	}

	public void setCategory(AmenitiesCategory category) {
		this.category = category;
	}
}
