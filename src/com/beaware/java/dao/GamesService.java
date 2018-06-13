/**
 * 
 */
package com.beaware.java.dao;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import com.beaware.java.domain.*;
import com.beaware.java.utility.Database;
import com.beaware.java.utility.SQLDatabase;

/**
 * @author rnagara7
 *
 */
public class GamesService {

	private Connection connection;

	// Delimiter used in CSV file
	private static final String COMMA_DELIMITER = ",";
	private static final String NEW_LINE_SEPARATOR = "\n";
	private static final String FILE_HEADER = "Game ID, Game Name, Employee ID, Employee Name, Employee Location, Employee Email, Score, Time Taken";
	private static final String FILE_DIR = "C:\\Program Files\\Apache Software Foundation\\Tomcat 7.0\\Scores\\";
	//private static final String FILE_DIR = "C:\\Users\\rnagara7\\Desktop\\Contract_Manager\\Softwares\\apache-tomcat-7.0.88-windows-x64\\apache-tomcat-7.0.88\\Scores";
	private static final String LOGIN_FILE_HEADER = "Employee ID, Employee Email";

	public void saveScore(Scores score) {
		try {
			String filePath = FILE_DIR + "/" + "BeAware_Scores_" + score.getEmpLocation()+".csv";
			File file = new File(filePath);
			if (!file.exists()) {
				createNewFile(file);
				writeCsvFile(file, score);
			}
			else{
				writeCsvFile(file, score);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@SuppressWarnings("null")
	public static void writeCsvFile(File file, Scores score) {
		FileWriter fileWriter = null;
		try {
			fileWriter = new FileWriter(file.getAbsoluteFile(), true);
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		try {
			BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
			// Add a new line separator after the header
			bufferedWriter.append(NEW_LINE_SEPARATOR);
			bufferedWriter.append(String.valueOf(score.getGameId()));
			bufferedWriter.append(COMMA_DELIMITER);
			bufferedWriter.append(score.getGameName());
			bufferedWriter.append(COMMA_DELIMITER);
			bufferedWriter.append(score.getEmpId());
			bufferedWriter.append(COMMA_DELIMITER);
			bufferedWriter.append(score.getEmpName());
			bufferedWriter.append(COMMA_DELIMITER);
			bufferedWriter.append(score.getEmpLocation());
			bufferedWriter.append(COMMA_DELIMITER);
			bufferedWriter.append(score.getEmpEmail());
			bufferedWriter.append(COMMA_DELIMITER);
			bufferedWriter.append(String.valueOf(score.getScore()));
			bufferedWriter.append(COMMA_DELIMITER);
			bufferedWriter.append(String.valueOf(score.getTime()));
			bufferedWriter.append(COMMA_DELIMITER);
			bufferedWriter.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@SuppressWarnings("null")
	public static void createNewFile(File file) {
		FileWriter fileWriter = null;
		try {
			file.createNewFile();
		} catch (IOException e) {
			e.printStackTrace();
		}
		try {
			fileWriter = new FileWriter(file.getAbsoluteFile(), true);
		} catch (IOException e) {
			e.printStackTrace();
		}
		BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
		try {
			bufferedWriter.append(FILE_HEADER.toString());
			bufferedWriter.append(COMMA_DELIMITER);
		} catch (IOException e) {
			e.printStackTrace();
		}
		try {
			bufferedWriter.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void saveEmpId(String empId, String empEmail) {
		try {
			String filePath = FILE_DIR + "/" + "BeAware_EmployeeIds.csv";
			File file = new File(filePath);
			if (!file.exists()) {
				createNewLoginFile(file);
				writeCsvLoginFile(file, empId, empEmail);
			}
			else{
				writeCsvLoginFile(file, empId, empEmail);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@SuppressWarnings("null")
	public static void writeCsvLoginFile(File file, String empId, String empEmail) {
		FileWriter fileWriter = null;
		try {
			fileWriter = new FileWriter(file.getAbsoluteFile(), true);
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		try {
			BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
			// Add a new line separator after the header
			bufferedWriter.append(NEW_LINE_SEPARATOR);
			bufferedWriter.append(empId);
			bufferedWriter.append(COMMA_DELIMITER);
			bufferedWriter.append(empEmail);
			bufferedWriter.append(COMMA_DELIMITER);
			bufferedWriter.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@SuppressWarnings("null")
	public static void createNewLoginFile(File file) {
		FileWriter fileWriter = null;
		try {
			file.createNewFile();
		} catch (IOException e) {
			e.printStackTrace();
		}
		try {
			fileWriter = new FileWriter(file.getAbsoluteFile(), true);
		} catch (IOException e) {
			e.printStackTrace();
		}
		BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
		try {
			bufferedWriter.append(LOGIN_FILE_HEADER.toString());
			bufferedWriter.append(COMMA_DELIMITER);
		} catch (IOException e) {
			e.printStackTrace();
		}
		try {
			bufferedWriter.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
