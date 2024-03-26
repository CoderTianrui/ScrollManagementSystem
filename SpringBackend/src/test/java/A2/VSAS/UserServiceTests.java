package A2.VSAS;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
class UserServiceTests {

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Test
    void allUsers() {
        List<User> all = userRepository.findAll();
        Mockito.when(userRepository.findAll()).thenReturn(all);
        List<User> users = userService.allUsers();
        assertNotNull(users);
    }

    @Test
    void registerUser() throws Exception {
        User user = Mockito.mock(User.class);
        Mockito.when(userRepository.insert(user)).thenReturn(user);
        Map<String, String> map = new HashMap<>();
        map.put("username","jason");
        map.put("password","123456Qw");
        map.put("email","123456@gmail.com");
        map.put("firstName","tom");
        map.put("lastName","jack");
        map.put("phone","131567890");
        map.put("avatar","doom");
        String s = userService.registerUser(map);
        assertNotNull(s);
    }


    @Test
    void getByUserName() {
        User users = new User();
        Mockito.when(userRepository.findUserByUserNameIgnoreCase("admin")).thenReturn(users);
        User result = userService.getByUserName("admin");
        assertNotNull(result);
    }

    @Test
    void encryptToken() throws Exception {
        User users = new User();
        Mockito.when(userRepository.findUserByUserNameIgnoreCase("admin")).thenReturn(users);
        String token = userService.encryptToken(users);
        assertNotNull(token);
    }

    @Test
    void encryptPassword() throws Exception {
        User users = new User();
        Mockito.when(userRepository.findUserByUserNameIgnoreCase("admin")).thenReturn(users);
        users.setPassword("123456Qw");
        String password = userService.encryptPassword(users.getPassword());
        assertNotNull(password);
    }

    @Test
    void decryptToken() throws Exception {
        User users = new User();
        Mockito.when(userRepository.findUserByUserNameIgnoreCase("admin")).thenReturn(users);
        String token = userService.encryptToken(users);
        assertNotNull(token);
    }

    @Test
    void varaifyToken() throws Exception {
        User users = new User();
        Mockito.when(userRepository.findUserByUserNameIgnoreCase("admin")).thenReturn(users);
        String token = userService.encryptToken(users);
        boolean result = userService.varaifyToken(token);
        assertNotNull(result);
    }


    @Test
    void TestGetByUserName() {
        User user = new User();
        Mockito.when(userRepository.findUserByUserNameIgnoreCase("admin")).thenReturn(user);
        User result = userService.getByUserName("admin");
        assertNotNull(result);
    }
}
