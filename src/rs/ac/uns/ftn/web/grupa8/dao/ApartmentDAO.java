package rs.ac.uns.ftn.web.grupa8.dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectMapper.DefaultTyping;

import rs.ac.uns.ftn.web.grupa8.beans.entities.Amenities;
import rs.ac.uns.ftn.web.grupa8.beans.entities.Apartment;

public class ApartmentDAO {

	private HashMap<Integer, Apartment> apartments = new HashMap<Integer, Apartment>();
	private String contextPath;

	public ApartmentDAO() {
		super();
		this.apartments = new HashMap<Integer, Apartment>();
	}

	public ApartmentDAO(String contextPath) {
		super();
		this.apartments = new HashMap<Integer, Apartment>();
		this.contextPath = contextPath;
		loadApartments();
	}

	public void saveApartments() {
		ObjectMapper mapper = new ObjectMapper();
		mapper.enableDefaultTyping(DefaultTyping.NON_FINAL);
		try {
			String sr = System.getProperty("file.separator");
			File f = new File(contextPath + sr + "apartments.json");

			if (!f.exists())
				if(!f.createNewFile())
					return;

			mapper.writerWithDefaultPrettyPrinter().writeValue(f, new ArrayList<Apartment>(apartments.values()));
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	public void loadApartments() {
		BufferedReader br = null;
		ObjectMapper mapper = new ObjectMapper();
		mapper.enableDefaultTyping(DefaultTyping.NON_FINAL);
		List<Apartment> loadedApartments = new ArrayList<>();
		try {
			String sr = System.getProperty("file.separator");
			File f = new File(contextPath + sr + "apartments.json");
			if (!f.exists())
				return;
			br = new BufferedReader(new FileReader(f));
			if (br != null) {
				loadedApartments = mapper.readValue(br, new TypeReference<ArrayList<Apartment>>() {
				});
				apartments.clear();

				for (Apartment apartment : loadedApartments) {
					apartments.put(apartment.getId(), apartment);
				}
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (Exception e) {
				}
			}
		}
	}

	public Collection<Apartment> getAll() {
		List<Apartment> allApartments = new ArrayList<Apartment>();
		apartments.values().forEach(a -> {
			if (!a.isDeleted())
				allApartments.add(a);
		});
		return allApartments;
	}

	public Apartment getById(int id) {
		Apartment apartment = apartments.getOrDefault(id, null);

		if (apartment != null && !apartment.isDeleted())
			return apartment;
		else {
			return null;
		}

	}

	public void removeAmenities(Amenities amenities) {
		for(Apartment a : apartments.values()) {
			if(a.getAmenities() != null) {
				for(Amenities amen : a.getAmenities()) {
					if(amenities.getId() == amen.getId()) {
						a.getAmenities().remove(amen);
					}
				}
			}
		}
	}
	
	public Apartment add(Apartment apartment) {
		int maxId = 0;
		for (int id : apartments.keySet()) {
			if (id > maxId)
				maxId = id;
		}
		apartment.setId(++maxId);
		apartments.put(apartment.getId(), apartment);
		saveApartments();
		return apartment;
	}

	public Apartment update(Apartment apartment) {
		Integer id = apartment.getId();
		Apartment forUpdate = apartments.getOrDefault(id, null);
		if (forUpdate != null && !forUpdate.isDeleted()) {
			forUpdate.setApartmentStatus(apartment.getApartmentStatus());
			forUpdate.setApartmentType(apartment.getApartmentType());
			forUpdate.setCheckInTime(apartment.getCheckInTime());
			forUpdate.setCheckOutTime(apartment.getCheckOutTime());
			forUpdate.setGuestNumber(apartment.getGuestNumber());
			forUpdate.setHost(apartment.getHost());
			forUpdate.setId(apartment.getId());
			forUpdate.setLocation(apartment.getLocation());
			forUpdate.setPriceByNight(apartment.getPriceByNight());
			forUpdate.setRoomNumber(apartment.getRoomNumber());
			forUpdate.setRentDates(apartment.getRentDates());
			forUpdate.setAmenities(apartment.getAmenities());
			forUpdate.setComments(apartment.getComments());
			forUpdate.setImagePaths(apartment.getImagePaths());
			forUpdate.setName(apartment.getName());
			saveApartments();
			return forUpdate;
		}
		return null;
	}

	public Boolean delete(Apartment apartment) {
		Apartment forDelete = apartments.getOrDefault(apartment.getId(), null);
		if (forDelete != null && !forDelete.isDeleted()) {
			forDelete.setDeleted(true);
			saveApartments();
			return true;
		}
		return false;
	}

}
