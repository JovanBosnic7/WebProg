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

public class CommentDAO {

	private HashMap<Integer, ApartmentComment> comments;
	private String contextPath;

	public CommentDAO() {
		super();
		this.comments = new HashMap<Integer, ApartmentComment>();
	}

	public CommentDAO(String contextPath) {
		super();
		this.comments = new HashMap<Integer, ApartmentComment>();
		this.contextPath = contextPath;
		loadComments();
	}

	public void saveComments() {
		ObjectMapper mapper = new ObjectMapper();
		mapper.enableDefaultTyping(DefaultTyping.NON_FINAL);
		try {
			String sr = System.getProperty("file.separator");
			File f = new File(contextPath + sr + "comments.json");

			if (!f.exists())
				if(!f.createNewFile())
					return;

			mapper.writerWithDefaultPrettyPrinter().writeValue(f, new ArrayList<ApartmentComment>(comments.values()));
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	public void loadComments() {
		BufferedReader br = null;
		ObjectMapper mapper = new ObjectMapper();
		mapper.enableDefaultTyping(DefaultTyping.NON_FINAL);
		List<ApartmentComment> loadedComments = new ArrayList<>();
		try {
			String sr = System.getProperty("file.separator");
			File f = new File(contextPath + sr + "comments.json");
			if (!f.exists())
				return;
			br = new BufferedReader(new FileReader(f));
			if (br != null) {
				loadedComments = mapper.readValue(br, new TypeReference<ArrayList<ApartmentComment>>() {
				});
				comments.clear();

				for (ApartmentComment comment : loadedComments) {
					comments.put(comment.getId(), comment);
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

	public Collection<ApartmentComment> getAll() {
		List<ApartmentComment> allComments = new ArrayList<ApartmentComment>();
		comments.values().forEach(c -> {
			if (!c.isDeleted())
				allComments.add(c);
		});
		return allComments;
	}

	public ApartmentComment getById(int id) {
		ApartmentComment comment = comments.getOrDefault(id, null);

		if (comment != null && !comment.isDeleted())
			return comment;
		else {
			return null;
		}

	}

	public Collection<ApartmentComment> getByApartment(Apartment apartment) {
		List<ApartmentComment> commentsByApartment = new ArrayList<ApartmentComment>();
		comments.values().forEach(c -> {
			if (!c.isDeleted() && c.getApartment().getId() == apartment.getId())
				commentsByApartment.add(c);
		});
		return commentsByApartment;

	}

	public ApartmentComment add(ApartmentComment comment) {
		int maxId = 0;
		for (int id : comments.keySet()) {
			if (id > maxId)
				maxId = id;
		}
		comment.setId(++maxId);
		comments.put(comment.getId(), comment);
		saveComments();
		return comment;
	}

	public ApartmentComment update(ApartmentComment comment) {
		ApartmentComment forUpdate = comments.getOrDefault(comment.getId(), null);
		if (forUpdate != null && !forUpdate.isDeleted()) {
			forUpdate.setApartment(comment.getApartment());
			forUpdate.setCommentText(comment.getCommentText());
			forUpdate.setGrade(comment.getGrade());
			forUpdate.setGuest(comment.getGuest());
			saveComments();
			return forUpdate;
		}
		return null;
	}

	public Boolean delete(ApartmentComment comment) {
		ApartmentComment forDelete = comments.getOrDefault(comment.getId(), null);
		if (forDelete != null && !forDelete.isDeleted()) {
			forDelete.setDeleted(true);
			saveComments();
			return true;
		}
		return false;
	}

}
