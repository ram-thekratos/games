/**
 * 
 */
package com.beaware.java.utility;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

/**
 * @author rnagara7
 *
 */
public class SQLDatabase {

	private static Connection connection = null;
    public static Connection getConnection() {
        if (connection != null)
            return connection;
        else {
            try {
             Properties prop = new Properties();
                InputStream inputStream = SQLDatabase.class.getClassLoader().getResourceAsStream("sql_database_connection.properties");
                prop.load(inputStream);
                String driver = prop.getProperty("driver");
                String url = prop.getProperty("url");
                String user = prop.getProperty("user");
                String password = prop.getProperty("password");
                try {
                    Class.forName(driver);
                } catch (ClassNotFoundException e) {
                    System.out.println("Where is your SQL JDBC Driver?");
                    e.printStackTrace();
                }
                connection = DriverManager.getConnection(url, user,password);
            } catch (SQLException e) {
                e.printStackTrace();
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return connection;
        }
    }
}
