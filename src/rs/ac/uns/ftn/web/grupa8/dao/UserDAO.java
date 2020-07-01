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

import rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy.User;

public class UserDAO {

	private HashMap<String, User> users = new HashMap<String, User>();
	private String contextPath;

	public UserDAO() {
		super();
		this.users = new HashMap<String, User>();
	}

	public UserDAO(String contextPath) {
		super();
		this.users = new HashMap<String, User>();
		this.contextPath = contextPath;
		loadUsers();
	}

	public void saveUsers() {
		ObjectMapper mapper = new ObjectMapper();
		try {
			String sr = System.getProperty("file.separator");
			File f = new File(contextPath + sr + "users.json");

			if (!f.exists())
				if(!f.createNewFile())
					return;
					
			mapper.writerWithDefaultPrettyPrinter().writeValue(f, users.values());
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	public void loadUsers() {
		BufferedReader br = null;
		ObjectMapper mapper = new ObjectMapper();
		List<User> loadedUsers = new ArrayList<>();
		try {
			String sr = System.getProperty("file.separator");
			File f = new File(contextPath + sr + "users.json");
			if (!f.exists())
				return;
			br = new BufferedReader(new FileReader(f));
			if (br != null) {
				loadedUsers = mapper.readValue(br, new TypeReference<List<User>>() {
				});
				users.clear();

				for (User user : loadedUsers) {
					users.put(user.getUsername(), user);
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

	public Collection<User> getAll() {
		List<User> allUsers = new ArrayList<User>();
		users.values().forEach(u -> {
			if (!u.isDeleted())
				allUsers.add(u);
		});
		return allUsers;
	}

	public User getByUsername(String username) {
		User user = users.getOrDefault(username, null);

		if (user != null && !user.isDeleted())
			return user;
		else {
			return null;
		}

	}

	public User add(User user) {
		if (users.containsKey(user.getUsername()))
			return null;
		else {
			users.put(user.getUsername(), user);
			saveUsers();
			return user;
		}
	}

	public User update(User user) {
		User forUpdate = users.getOrDefault(user.getUsername(), null);
		if (forUpdate != null && !forUpdate.isDeleted()) {
			forUpdate.setFirstname(user.getFirstname());
			forUpdate.setGender(user.getGender());
			forUpdate.setLastname(user.getLastname());
			forUpdate.setPassword(user.getPassword());
			saveUsers();
			return forUpdate;
		}
		return null;
	}

	public Boolean delete(User user) {
		User forDelete = users.getOrDefault(user.getUsername(), null);
		if (forDelete != null && !forDelete.isDeleted()) {
			forDelete.setDeleted(true);
			saveUsers();
			return true;
		}
		return false;
	}

}
