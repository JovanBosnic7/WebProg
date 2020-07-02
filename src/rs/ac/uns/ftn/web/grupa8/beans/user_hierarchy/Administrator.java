package rs.ac.uns.ftn.web.grupa8.beans.user_hierarchy;

import rs.ac.uns.ftn.web.grupa8.beans.enums.AccountType;
import rs.ac.uns.ftn.web.grupa8.beans.enums.Gender;

public class Administrator extends User {

	private static final long serialVersionUID = -7157464388558989234L;

	public Administrator() {
		super();
	}

	public Administrator(int id, String username, String password, String firstname, String lastname, Gender gender, Boolean deleted) {
		super(id, username, password, firstname, lastname, gender, AccountType.ADMINISTRATOR, deleted);
	}
	
}
