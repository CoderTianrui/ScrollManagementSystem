package A2.VSAS;


import com.mongodb.client.result.UpdateResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class UserService {
    private final String key = "9999999999999999";
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private UserRepository userRepository;

    public List<User> allUsers() {
        return userRepository.findAll();
    }

    public User getByUserName(String UserName) {
        return userRepository.findUserByUserNameIgnoreCase(UserName);
    }

    public int getUserIdByUserName(String UserName) {
        return userRepository.findUserByUserNameIgnoreCase(UserName).getUserId();
    }

    public String encryptToken(User user) throws Exception {
        Cipher cipher = Cipher.getInstance("AES");
        Instant expirationTime = Instant.now().plus(24, ChronoUnit.HOURS);
        String expirationTimeString = expirationTime.toString();
        String originToken = user.getUserName() + " " + user.getRole() + " " + expirationTimeString;
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "AES");
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        byte[] token = cipher.doFinal(originToken.getBytes());
        String base64Token = Base64.getEncoder().encodeToString(token);
        return base64Token;
    }

    public String encryptPassword(String password) throws Exception {
        Cipher cipher = Cipher.getInstance("AES");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "AES");
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        byte[] encryptedPassword = cipher.doFinal(password.getBytes());
        String base64Password = Base64.getEncoder().encodeToString(encryptedPassword);

        return base64Password;
    }

    public String decryptToken(String token) throws Exception {
        Cipher cipher = Cipher.getInstance("AES");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "AES");
        cipher.init(Cipher.DECRYPT_MODE, secretKey);
        byte[] originToken = cipher.doFinal(Base64.getDecoder().decode(token));
        String originTokenString = new String(originToken);
        return originTokenString;
    }

    public boolean varaifyToken(String token) throws Exception {
        String[] tokenArray = decryptToken(token).split(" ");
        String userName = tokenArray[0];
        String role = tokenArray[1];
        String expirationTimeString = tokenArray[2];
        Instant expirationTime = Instant.parse(expirationTimeString);
        if (Instant.now().isAfter(expirationTime)) {
            return false;
        }
        User user = getByUserName(userName);
        if (user == null) {
            return false;
        }
        return user.getRole().equals(role);
    }

    public String registerUser(Map<String, String> register) throws Exception {
        String userName = register.get("username");
        String password = register.get("password");
        String email = register.get("email");
        String firstName = register.get("firstName");
        String lastName = register.get("lastName");
        String avatar = register.get("avatar");
        String phone = register.get("phone");
        User user = new User();

        if (userRepository.findUserByUserNameIgnoreCase(userName) != null) {
            return "Username already exists";
        }
        if (userName.length() < 3 || userName.length() > 10 || userName.matches(".*[^a-zA-Z0-9].*")) {
            return "Username length should be between 3 and 10 and only contain letters and numbers";
        }
        if (password.length() < 6 || password.length() > 20 || password.matches(".*[^a-zA-Z0-9].*")) {
            return "Password length should be between 6 and 20 and only contain letters and numbers";
        }
        if (userRepository.findUserByEmailIgnoreCase(email) != null) {
            return "Email already exists";
        }

        if (!email.matches("^[a-zA-Z0-9_+&*-]+(?:\\." + "[a-zA-Z0-9_+&*-]+)*@" + "(?:[a-zA-Z0-9-]+\\.)+[a-z" + "A-Z]{2,7}$")) {
            return "Email is not valid";
        }
        if (firstName.length() < 1 || firstName.length() > 10 || firstName.matches(".*[^a-zA-Z].*")) {
            return "First name length should be between 1 and 10 and only contain letters";
        }
        if (lastName.length() < 1 || lastName.length() > 10 || lastName.matches(".*[^a-zA-Z].*")) {
            return "Last name length should be between 1 and 10 and only contain letters";
        }
        int userId = userRepository.findAll().size();
        while (userRepository.findUserByUserId(userId) != null) {
            userId = userId + 5;
        }
        user.setUserId(userId);
        user.setUserName(userName);
        user.setPassword(encryptPassword(password));
        user.setEmail(email);
        if (phone.length() != 0) {
            if (phone.length() != 10 || phone.matches(".*[^0-9].*")) {
                return "Phone number should be 10 digits";
            } else {
                user.setPhone(phone);
            }
        }
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setAvatar(avatar);
        user.setLikesReceived(0);
        user.setRole("user");
        userRepository.insert(user);
        likeArray(userId);
        return "success";
    }

    public String changeUserProfile(Map<String, String> tokenAndProfile) throws Exception {
        String base64Token = tokenAndProfile.get("token");
        String originToken = decryptToken(base64Token);
        String[] tokenArray = originToken.split(" ");
        String userName = tokenArray[0];
        String avatar = tokenAndProfile.get("avatar");
        String email = tokenAndProfile.get("email");
        String phone = tokenAndProfile.get("phone");
        String firstName = tokenAndProfile.get("firstName");
        String lastName = tokenAndProfile.get("lastName");
        String currentPassword = tokenAndProfile.get("currentPassword");
        String newPassword = tokenAndProfile.get("newPassword");
        User user = getByUserName(userName);
        if (user == null) {
            return "User not found";
        }
        if (userRepository.findUserByEmailIgnoreCase(email) != null && !user.getEmail().equals(email)) {
            return "Email already exists";
        }
        if (!email.matches("^[a-zA-Z0-9_+&*-]+(?:\\." + "[a-zA-Z0-9_+&*-]+)*@" + "(?:[a-zA-Z0-9-]+\\.)+[a-z" + "A-Z]{2,7}$")) {
            return "Email is not valid";
        }
        if (phone.length() != 0) {
            if (phone.length() != 10 || phone.matches(".*[^0-9].*")) {
                return "Phone number should be 10 digits";
            } else {
                user.setPhone(phone);
            }
        }
        if (firstName.length() < 1 || firstName.length() > 10 || firstName.matches(".*[^a-zA-Z].*")) {
            return "First name length should be between 1 and 10 and only contain letters";
        }
        if (lastName.length() < 1 || lastName.length() > 10 || lastName.matches(".*[^a-zA-Z].*")) {
            return "Last name length should be between 1 and 10 and only contain letters";
        }
        if (newPassword.length() != 0) {
            if (newPassword.length() < 6 || newPassword.length() > 20 || newPassword.matches(".*[^a-zA-Z0-9].*")) {
                return "Password length should be between 6 and 20 and only contain letters and numbers";
            }
            if (!decryptToken(user.getPassword()).equals(currentPassword)) {
                return "Current password is not correct";
            }
            user.setPassword(encryptPassword(newPassword));
        }
        user.setAvatar(avatar);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        userRepository.save(user);
        return "success";
    }

    public void likeReceived(int userId) {
        User user = userRepository.findUserByUserId(userId);
        user.setLikesReceived(user.getLikesReceived() + 1);
        userRepository.save(user);
    }

    public void likeReceivedCancel(int userId) {
        User user = userRepository.findUserByUserId(userId);
        user.setLikesReceived(user.getLikesReceived() - 1);
        userRepository.save(user);
    }

    public void likeArray(int userId) {
        Query query = new Query(Criteria.where("userId").is(userId));
        Update update = new Update();
        update.push("likeScrollIds", -1);
        UpdateResult result = mongoTemplate.updateFirst(query, update, User.class);
        query = new Query(Criteria.where("userId").is(userId));
        update = new Update();
        update.pull("likeScrollIds", -1);
        result = mongoTemplate.updateFirst(query, update, User.class);

    }
}
