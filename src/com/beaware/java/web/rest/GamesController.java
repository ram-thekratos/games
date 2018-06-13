/**
 * 
 */
package com.beaware.java.web.rest;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author rnagara7
 *
 */

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import com.beaware.java.dao.*;
import com.beaware.java.domain.*;

@Path("gamesCtrl")
public class GamesController {

	GamesService gamesService = new GamesService();
	private static final String FILE_DIR = "C:\\Program Files\\Apache Software Foundation\\Tomcat 7.0\\Scores\\";
	//private static final String FILE_DIR = "C:\\Users\\rnagara7\\Desktop\\Contract_Manager\\Softwares\\apache-tomcat-7.0.88-windows-x64\\apache-tomcat-7.0.88\\Scores";
	private static List loggedInIds = new ArrayList<String>();
	private static Map<String, String> loggedInEmployees = new HashMap<String, String>();

	@GET
	@Path("/test")
	@Produces(MediaType.APPLICATION_JSON)
	public boolean test() {
		return true;
	}

	@POST
	@Path("/save")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public void saveScore(Scores score) {
		gamesService.saveScore(score);
	}

	@GET
	@Path("/getScores")
	@Produces("text/csv")
	public Response getFile(@QueryParam("location") String location) {
		String filePath = FILE_DIR + "/" + "BeAware_Scores_" + location + ".csv";
		File file = new File(filePath);

		ResponseBuilder response = Response.ok((Object) file);
		response.header("Content-Disposition", "attachment;filename=\"report.csv\"");
		return response.build();

	}

	@SuppressWarnings("unchecked")
	@GET
	@Path("/login")
	@Produces(MediaType.APPLICATION_JSON)
	public boolean loginUser(@QueryParam("empId") String empId, @QueryParam("empEmail") String empEmail) {
		boolean loggedIn = false;
		if (loggedInIds.contains(empId)) {
			loggedIn = true;
		} else if (returnIdsFromFile().contains(empId)) {
			loggedIn = true;
		} else if (loggedInEmployees.get(empEmail) != null) {
			loggedIn = true;
		} else {
			loggedInIds.add(empId);
			loggedInEmployees.put(empEmail, empId);
			gamesService.saveEmpId(empId, empEmail);
			loggedIn = false;
		}
		return loggedIn;

	}

	@SuppressWarnings("unchecked")
	private List returnIdsFromFile() {
		List idsInFile = new ArrayList<String>();
		String filePath = FILE_DIR + "/" + "BeAware_EmployeeIds.csv";
		File file = new File(filePath);
		if (!file.exists()) {
			return idsInFile;
		} else {
			String line = "";
			String cvsSplitBy = ",";
			try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
				while ((line = br.readLine()) != null) {
					String[] empIDs = line.split(cvsSplitBy);
					idsInFile.add(empIDs[0]);
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
			return idsInFile;
		}
	}
}
