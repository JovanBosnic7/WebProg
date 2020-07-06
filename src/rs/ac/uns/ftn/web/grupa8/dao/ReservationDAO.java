package rs.ac.uns.ftn.web.grupa8.dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectMapper.DefaultTyping;

import rs.ac.uns.ftn.web.grupa8.beans.entities.ApartmentRentDate;
import rs.ac.uns.ftn.web.grupa8.beans.entities.Reservation;
import rs.ac.uns.ftn.web.grupa8.beans.enums.ReservationStatus;

public class ReservationDAO {

	private HashMap<Integer, Reservation> reservations;
	private String contextPath;

	public ReservationDAO() {
		super();
		this.reservations = new HashMap<Integer, Reservation>();
	}

	public ReservationDAO(String contextPath) {
		super();
		this.reservations = new HashMap<Integer, Reservation>();
		this.contextPath = contextPath;
		loadReservations();
	}

	public void saveReservations() {
		ObjectMapper mapper = new ObjectMapper();
		mapper.enableDefaultTyping(DefaultTyping.NON_FINAL);
		try {
			String sr = System.getProperty("file.separator");
			File f = new File(contextPath + sr + "reservations.json");

			if (!f.exists())
				if (!f.createNewFile())
					return;

			mapper.writerWithDefaultPrettyPrinter().writeValue(f, new ArrayList<Reservation>(reservations.values()));
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	public void loadReservations() {
		BufferedReader br = null;
		ObjectMapper mapper = new ObjectMapper();
		mapper.enableDefaultTyping(DefaultTyping.NON_FINAL);
		List<Reservation> loadedReservations = new ArrayList<>();
		try {
			String sr = System.getProperty("file.separator");
			File f = new File(contextPath + sr + "reservations.json");
			if (!f.exists())
				return;
			br = new BufferedReader(new FileReader(f));
			if (br != null) {
				loadedReservations = mapper.readValue(br, new TypeReference<ArrayList<Reservation>>() {
				});
				reservations.clear();

				for (Reservation reservation : loadedReservations) {
					reservations.put(reservation.getId(), reservation);
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

	public Collection<Reservation> getAll() {
		List<Reservation> reservationList = new ArrayList<Reservation>();
		reservations.values().forEach(a -> {
			if (!a.isDeleted())
				reservationList.add(a);
		});
		return reservationList;
	}

	public Collection<Reservation> getByApartment(int id, String username) {
		List<Reservation> reservationList = new ArrayList<Reservation>();
		reservations.values().forEach(a -> {
			if (!a.isDeleted() && a.getApartment().getId() == id && a.getGuest().getUsername().equals(username)) {
				if (a.getStatus() == ReservationStatus.COMPLETED || a.getStatus() == ReservationStatus.REFUSED) {
					reservationList.add(a);
				}
			}
		});
		return reservationList;
	}

	public Collection<Reservation> getByHost(int id) {
		List<Reservation> reservationList = new ArrayList<Reservation>();
		reservations.values().forEach(a -> {
			if (!a.isDeleted() && a.getApartment().getHost().getId() == id)
				reservationList.add(a);
		});
		return reservationList;
	}

	public Reservation getById(int id) {
		Reservation reservation = reservations.getOrDefault(id, null);

		if (reservation != null && !reservation.isDeleted())
			return reservation;
		else {
			return null;
		}

	}

	public Reservation add(Reservation reservation) {
		int maxId = 0;
		for (int id : reservations.keySet()) {
			if (id > maxId)
				maxId = id;
		}

		Date startDate = new Date(reservation.getStartDate().getTime());
		Calendar cal = Calendar.getInstance();
		cal.setTime(startDate);
		cal.add(Calendar.DATE, reservation.getNightsNumber());
		Date endDate = cal.getTime();
		cal.setTime(startDate);
		Date d = cal.getTime();
		System.out.println(startDate.toString() + ' ' + endDate.toString());
		for (ApartmentRentDate rentDate : reservation.getApartment().getRentDates()) {
			while (d.compareTo(endDate) < 0) {
				int flag = rentDate.getDate().compareTo(d);
				System.out.println(flag);
				if (flag >= 0 && flag < 1) {
					if (!rentDate.getAvailable()) {
						return null;
					}
				}

				cal.add(Calendar.DATE, 1);
				d = cal.getTime();
			}
		}
		reservation.setTotalPrice(reservation.getApartment().getPriceByNight() * reservation.getNightsNumber());
		reservation.setId(++maxId);
		reservations.put(reservation.getId(), reservation);
		saveReservations();
		return reservation;
	}

	public Reservation update(Reservation reservation) {
		Reservation forUpdate = reservations.getOrDefault(reservation.getId(), null);
		if (forUpdate != null && !forUpdate.isDeleted()) {
			forUpdate.setApartment(reservation.getApartment());
			forUpdate.setGuest(reservation.getGuest());
			forUpdate.setNightsNumber(reservation.getNightsNumber());
			forUpdate.setReservationMessage(reservation.getReservationMessage());
			forUpdate.setStartDate(reservation.getStartDate());
			forUpdate.setStatus(reservation.getStatus());
			forUpdate.setTotalPrice(reservation.getTotalPrice());
			saveReservations();
			return forUpdate;
		}
		return null;
	}

	public Boolean delete(Reservation reservation) {
		Reservation forDelete = reservations.getOrDefault(reservation.getId(), null);
		if (forDelete != null && !forDelete.isDeleted()) {
			forDelete.setDeleted(true);
			saveReservations();
			return true;
		}
		return false;
	}

}
