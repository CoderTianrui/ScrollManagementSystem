package A2.VSAS;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VsasApplication {
    public static void main(String[] args) {
        SpringApplication.run(VsasApplication.class, args);
        System.out.println("Open http://localhost:8095 in your browser for testing.");
    }
}
