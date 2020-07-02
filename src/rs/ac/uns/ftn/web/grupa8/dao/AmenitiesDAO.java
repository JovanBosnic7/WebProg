package rs.ac.uns.ftn.web.grupa8.dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectMapper.DefaultTyping;

import rs.ac.uns.ftn.web.grupa8.beans.entities.*;

public class AmenitiesDAO {

	private HashMap<Integer, Amenities> allAmenities;
	private String contextPath;

	public AmenitiesDAO() {
		super();
		this.allAmenities = new HashMap<Integer, Amenities>();
	}

	public AmenitiesDAO(String contextPath) {
		super();
		this.allAmenities = new HashMap<Integer, Amenities>();
		this.contextPath = contextPath;
		loadAmenities();
	}

	public void saveAmenities() {
		ObjectMapper mapper = new ObjectMapper();
		mapper.enableDefaultTyping(DefaultTyping.NON_FINAL);
		try {
			String sr = System.getProperty("file.separator");
			File f = new File(contextPath + sr + "amenities.json");

			if (!f.exists())
				if(!f.createNewFile())
					return;

			mapper.writerWithDefaultPrettyPrinter().writeValue(f, new ArrayList<Amenities>(allAmenities.values()));
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	public void loadAmenities() {
		BufferedReader br = null;
		ObjectMapper mapper = new ObjectMapper();
		mapper.enableDefaultTyping(DefaultTyping.NON_FINAL);
		List<Amenities> loadedAmenities = new ArrayList<>();
		try {
			String sr = System.getProperty("file.separator");
			File f = new File(contextPath + sr + "amenities.json");
			if (!f.exists())
				return;
			br = new BufferedReader(new FileReader(f));
			if (br != null) {
				loadedAmenities = mapper.readValue(br, new TypeReference<ArrayList<Amenities>>() {
				});
				allAmenities.clear();

				for (Amenities amenities : loadedAmenities) {
					allAmenities.put(amenities.getId(), amenities);
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

	public Collection<Amenities> getAll() {
		List<Amenities> amenitiesList = new ArrayList<Amenities>();
		allAmenities.values().forEach(a -> {
			if (!a.isDeleted())
				amenitiesList.add(a);
		});
		return amenitiesList;
	}

	public Amenities getById(int id) {
		Amenities amenities = allAmenities.getOrDefault(id, null);

		if (amenities != null && !amenities.isDeleted())
			return amenities;
		else {
			return null;
		}

	}

	public Amenities add(Amenities amenities) {
		int maxId = 0;
		for (int id : allAmenities.keySet()) {
			if (id > maxId)
				maxId = id;
		}
		amenities.setId(++maxId);
		allAmenities.put(amenities.getId(), amenities);
		saveAmenities();
		return amenities;
	}

	public Amenities update(Amenities amenities) {
		Amenities forUpdate = allAmenities.getOrDefault(amenities.getId(), null);
		if (forUpdate != null && !forUpdate.isDeleted()) {
			forUpdate.setCategory(amenities.getCategory());
			forUpdate.setDescription(amenities.getDescription());
			forUpdate.setName(amenities.getName());
			saveAmenities();
			return forUpdate;
		}
		return null;
	}

	public Boolean delete(Amenities amenities) {
		Amenities forDelete = allAmenities.getOrDefault(amenities.getId(), null);
		if (forDelete != null && !forDelete.isDeleted()) {
			forDelete.setDeleted(true);
			saveAmenities();
			return true;
		}
		return false;
	}

}
