/**
 * 
 */
package com.beaware.java.web.rest;

/**
 * @author rnagara7
 *
 */
import javax.ws.rs.ApplicationPath;
import org.glassfish.jersey.server.ResourceConfig;

@ApplicationPath("games")
public class RestBase extends ResourceConfig {
    public RestBase() {
        packages("com.fasterxml.jackson.jaxrs.json");
        packages("com.beaware.java.web.rest");
    }
}
