package rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy;

import java.io.Serializable;

import rs.ac.uns.ftn.web.grupa8.beans.enums.*;

public class User implements Serializable {

	private static final long serialVersionUID = 4400427491164337161L;
	private String username;
	private String password;
	private String firstname;
	private String lastname;
	private Gender gender;
	private AccountType accountType;
	private Boolean deleted;

	public User() {
		super();
	}

	public User(String username, String password, String firstname, String lastname, Gender gender,
			AccountType accountType, Boolean deleted) {
		super();
		this.username = username;
		this.password = password;
		this.firstname = firstname;
		this.lastname = lastname;
		this.gender = gender;
		this.accountType = accountType;
		this.deleted = deleted;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public Gender getGender() {
		return gender;
	}

	public void setGender(Gender gender) {
		this.gender = gender;
	}

	public AccountType getAccountType() {
		return accountType;
	}

	public void setAccountType(AccountType accountType) {
		this.accountType = accountType;
	}

	public Boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
	}

}
