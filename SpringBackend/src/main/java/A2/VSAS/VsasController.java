package A2.VSAS;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class VsasController {
    @Autowired
    private UserService userService;
    @Autowired
    private ScrollService scrollService;


    @GetMapping("/scrolls/{searchCondition}/{sortCondition}/{value}")
    public ResponseEntity<List<Scroll>> getScrollsByCondition(@PathVariable String searchCondition, @PathVariable String sortCondition, @PathVariable String value) {
        List<Scroll> scrolls = scrollService.allScrolls();

        if (value.equals("*")) {
            scrolls = scrollService.allScrolls();
        } else if (searchCondition.equals("BySName")) {
            scrolls = scrollService.getScrollsByScrollName(value);
        } else if (searchCondition.equals("ByUName")) {
            scrolls = scrollService.getScrollsByUploaderName(value);
        }

        if (sortCondition.equals("UploadDate")) {
            scrolls = scrollService.sortByUploadDate(scrolls);
        } else if (sortCondition.equals("Downloads")) {
            scrolls = scrollService.sortByDownloads(scrolls);
        } else if (sortCondition.equals("Likes")) {
            scrolls = scrollService.sortByLikes(scrolls);
        } else if (sortCondition.equals("LastModified")) {
            scrolls = scrollService.sortByLastModified(scrolls);
        }

        return new ResponseEntity<List<Scroll>>(scrolls, HttpStatus.OK);
    }

    @GetMapping("/scrolls/randomScroll")
    public ResponseEntity<Scroll> getRandomScroll() {
        return new ResponseEntity<Scroll>(scrollService.randomScroll(), HttpStatus.OK);
    }

    @PostMapping("/scrolls/upload")
    public ResponseEntity<?> uploadScroll(@RequestBody Map<String, String> tokenAndScroll) throws Exception {
        String base64Token = tokenAndScroll.get("token");
        String originToken = userService.decryptToken(base64Token);
        boolean valid = userService.varaifyToken(base64Token);
        if (!valid) {
            return ResponseEntity.badRequest().body("Token invalid");
        } else {
            String[] tokenArray = originToken.split(" ");
            String userName = tokenArray[0];
            int userId = userService.getUserIdByUserName(userName);
            String scrollName = tokenAndScroll.get("scrollName");
            String scrollDescription = tokenAndScroll.get("scrollDescription");
            String scrollContent = tokenAndScroll.get("scrollContent");
            String uploadStatus = scrollService.uploadScroll(userId, userName, scrollName, scrollDescription, scrollContent);
            if (uploadStatus == "success") {
                return ResponseEntity.ok("Upload success");
            } else {
                return ResponseEntity.badRequest().body(uploadStatus);
            }
        }
    }

    @PostMapping("/scrolls/update")
    public ResponseEntity<?> updateScroll(@RequestBody Map<String, String> tokenAndScroll) throws Exception {
        String base64Token = tokenAndScroll.get("token");
        String originToken = userService.decryptToken(base64Token);
        boolean valid = userService.varaifyToken(base64Token);
        if (!valid) {
            return ResponseEntity.badRequest().body("Token invalid");
        } else {
            String[] tokenArray = originToken.split(" ");
            String userName = tokenArray[0];
            String userRole = tokenArray[1];
            String scrollName = tokenAndScroll.get("scrollNameState");
            String scrollDescription = tokenAndScroll.get("scrollDescriptionState");
            String scrollContent = tokenAndScroll.get("scrollContentState");
            int scrollId = Integer.parseInt(tokenAndScroll.get("scrollIdState"));
            String updateStatus = scrollService.updateScroll(userRole, userName, scrollName, scrollDescription, scrollContent, scrollId);
            if (updateStatus == "success") {
                return ResponseEntity.ok("Update success");
            } else {
                return ResponseEntity.badRequest().body(updateStatus);
            }
        }
    }

    @PostMapping("/scrolls/delete")
    public ResponseEntity<?> deleteScroll(@RequestBody Map<String, String> tokenAndScroll) throws Exception {
        String base64Token = tokenAndScroll.get("token");
        String originToken = userService.decryptToken(base64Token);
        boolean valid = userService.varaifyToken(base64Token);
        if (!valid) {
            return ResponseEntity.badRequest().body("Token invalid");
        } else {
            String[] tokenArray = originToken.split(" ");
            String userName = tokenArray[0];
            String userRole = tokenArray[1];
            int scrollId = Integer.parseInt(tokenAndScroll.get("scrollIdState"));
            String deleteStatus = scrollService.deleteScroll(userRole, userName, scrollId);
            if (deleteStatus == "success") {
                return ResponseEntity.ok("Delete success");
            } else {
                return ResponseEntity.badRequest().body(deleteStatus);
            }
        }
    }

    @PostMapping("/scrolls/like")
    public ResponseEntity<?> toggleLikeScroll(@RequestBody Map<String, String> tokenAndScroll) throws Exception {
        String base64Token = tokenAndScroll.get("token");
        String originToken = userService.decryptToken(base64Token);
        boolean valid = userService.varaifyToken(base64Token);
        if (!valid) {
            return ResponseEntity.badRequest().body("Token invalid");
        } else {
            String[] tokenArray = originToken.split(" ");
            String userName = tokenArray[0];
            int scrollId = Integer.parseInt(tokenAndScroll.get("scrollId"));
            String likeStatus = scrollService.toggleLikeScroll(userName, scrollId);
            if (likeStatus == "success") {
                return ResponseEntity.ok("Like success");
            } else {
                return ResponseEntity.badRequest().body(likeStatus);
            }
        }
    }

    @PostMapping("/user/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginUser) throws Exception {
        Random rand = new Random();
        int delayInMillis = rand.nextInt(800);
        Thread.sleep(delayInMillis);
        String loginUsername = loginUser.get("username");
        String loginPassword = loginUser.get("password");
        User user = userService.getByUserName(loginUsername);
        if (user == null) {
            return ResponseEntity.badRequest().body("Login failed!");
        } else if (!userService.decryptToken(user.getPassword()).equals(loginPassword)) {
            return ResponseEntity.badRequest().body("Login failed!");
        } else {
            return ResponseEntity.ok(userService.encryptToken(user));
        }
    }

    @PostMapping("/user/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> registUser) throws Exception {
        String status = userService.registerUser(registUser);
        if (status == "success") {
            return ResponseEntity.ok("Register success");
        } else {
            return ResponseEntity.badRequest().body(status);
        }
    }

    @PostMapping("/user/profile")
    public ResponseEntity<?> getUserProfile(@RequestBody Map<String, String> token) throws Exception {
        String base64Token = token.get("token");
        if (base64Token == null) {
            return ResponseEntity.badRequest().body("Token invalid");
        }
        String originToken = userService.decryptToken(base64Token);
        boolean valid = userService.varaifyToken(base64Token);
        if (!valid) {
            return ResponseEntity.badRequest().body("Token invalid");
        } else {
            String[] tokenArray = originToken.split(" ");
            String userName = tokenArray[0];
            User user = userService.getByUserName(userName);
            user.setPassword(null);
            return ResponseEntity.ok(user);
        }
    }

<<<<<<< HEAD
    @PutMapping("/updateScroll/{scrollId}")
    public ResponseEntity<?> updateScroll(@PathVariable int scrollId, @RequestBody Map<String, String> tokenAndScroll) throws Exception {
        String base64Token = tokenAndScroll.get("token");
        String originToken = userService.decryptToken(base64Token);
        boolean valid = userService.varaifyToken(base64Token);

        if (!valid) {
            return ResponseEntity.badRequest().body("Token invalid");
        } else {
            String[] tokenArray = originToken.split(" ");
            String userName = tokenArray[0];

            String scrollName = tokenAndScroll.get("scrollName");
            String scrollDescription = tokenAndScroll.get("scrollDescription");
            String scrollContent = tokenAndScroll.get("scrollContent");

            String updateStatus = scrollService.updateScroll(scrollId, userName, scrollName, scrollDescription, scrollContent);

            if ("success".equals(updateStatus)) {
                return ResponseEntity.ok("Update success");
            } else {
                return ResponseEntity.badRequest().body(updateStatus);
            }
        }
=======
    @PostMapping("/user/changeProfile")
    public ResponseEntity<?> changeUserProfile(@RequestBody Map<String, String> tokenAndProfile) throws Exception {
        String base64Token = tokenAndProfile.get("token");
        String originToken = userService.decryptToken(base64Token);
        boolean valid = userService.varaifyToken(base64Token);
        if (!valid) {
            return ResponseEntity.badRequest().body("Token invalid");
        } else {
            String status = userService.changeUserProfile(tokenAndProfile);
            if (status == "success") {
                return ResponseEntity.ok("success");
            } else {
                return ResponseEntity.badRequest().body(status);
            }
        }
    }
>>>>>>> bb4eb17cd8c172aa8125a914854a40ffbe1d85ce

}
