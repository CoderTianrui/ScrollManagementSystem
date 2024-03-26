package A2.VSAS;

import com.mongodb.client.result.UpdateResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScrollService {
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private ScrollRepository scrollRepository;
    @Autowired
    private UserService userService;

    public Scroll getByScrollId(int ScrollId) {
        return scrollRepository.findScrollByScrollId(ScrollId);
    }

    public List<Scroll> allScrolls() {
        return scrollRepository.findAll();
    }

    public List<Scroll> getScrollsByScrollName(String scrollName) {
        return scrollRepository.findByScrollNameContainsIgnoreCase(scrollName);
    }

    public List<Scroll> getScrollsByUploaderName(String uploadUserName) {
        return scrollRepository.findByUploadUserNameContainsIgnoreCase(uploadUserName);
    }

    public List<Scroll> sortByDownloads(List<Scroll> scrolls) {
        return scrolls.stream().sorted(Comparator.comparing(Scroll::getDownloads).reversed()).collect(Collectors.toList());
    }

    public List<Scroll> sortByLikes(List<Scroll> scrolls) {
        return scrolls.stream().sorted(Comparator.comparing(Scroll::getLikes).reversed()).collect(Collectors.toList());
    }

    public List<Scroll> sortByUploadDate(List<Scroll> scrolls) {
        return scrolls.stream().sorted(Comparator.comparing(Scroll::getUploadDate).reversed()).collect(Collectors.toList());
    }

    public List<Scroll> sortByLastModified(List<Scroll> scrolls) {
        return scrolls.stream().sorted(Comparator.comparing(Scroll::getLastModified).reversed()).collect(Collectors.toList());
    }

    public Scroll randomScroll() {
        List<Scroll> scrolls = scrollRepository.findAll();
        int random = (int) (Math.random() * scrolls.size());
        return scrolls.get(random);
    }

    public String uploadScroll(int userId, String userName, String scrollName, String scrollDescription, String scrollContent) {
        Scroll scroll = new Scroll();
        int scrollId = scrollRepository.findAll().size();
        while (scrollRepository.findScrollByScrollId(scrollId) != null) {
            scrollId = scrollId + 5;
        }

        scroll.setScrollId(scrollId);

        if (scrollName.length() < 2 || scrollName.length() > 50) {
            return "Scroll name must be between 2 and 50 characters";
        } else if (scrollRepository.findScrollByScrollNameIgnoreCase(scrollName) != null) {
            return "Scroll name already exists";
        } else if (!scrollName.matches("[a-zA-Z0-9 ,.'/:;@!$%&()-*?\"]*")) {
            return "Scroll name must only contain letters, numbers, and spaces";
        } else if (!scrollName.matches(".*[a-zA-Z0-9].*")) {
            return "Scroll name must contain at least one alphabet letter or number";
        } else {
            scroll.setScrollName(scrollName);
        }

        if (scrollDescription.length() > 150) {
            return "Scroll description must be less than 150 characters";
        } else if (!scrollDescription.matches("[a-zA-Z0-9 ,.'/:;@!$%&()-*?\"]*")) {
            return "Scroll description must only contain letters, numbers, and spaces";
        } else if (!scrollDescription.matches(".*[a-zA-Z].*")) {
            return "Scroll description must contain at least one alphabet letter";
        } else {
            scroll.setScrollDescription(scrollDescription);
        }

        if (scrollContent.length() > 2000) {
            return "Scroll content must be less than 2000 characters";
        } else if (!scrollContent.matches("[01]*")) {
            return "Scroll content must only contain 0 and 1";
        } else {
            scroll.setScrollContent(scrollContent);
        }

        scroll.setLikes(0);
        scroll.setDownloads(0);
        scroll.setUploadUserName(userName);
        scroll.setUploadUserId(userId);
        scroll.setUploadDate(new java.util.Date());
        scroll.setLastModified(new java.util.Date());
        scrollRepository.insert(scroll);

        Query query = new Query(Criteria.where("userName").is(userName));
        Update update = new Update();
        update.push("uploadScrollIds", scrollId);
        UpdateResult result = mongoTemplate.updateFirst(query, update, User.class);

        if (result == null) {
            System.out.println("No documents updated");
            return "No documents updated";
        } else {
            System.out.println(result.getModifiedCount() + " document(s) updated..");
            return "success";
        }
    }

<<<<<<< HEAD
    public String updateScroll(int scrollId, String userName, String scrollName, String scrollDescription, String scrollContent) {
        Scroll existingScroll = getByScrollId(scrollId);
        if (existingScroll == null) {
            return "Scroll with the given ID does not exist.";
        }

        // Scroll Name validation
        if (scrollName.length() < 4 || scrollName.length() > 35) {
            return "Scroll name must be between 4 and 35 characters";
        } else if (!scrollName.equalsIgnoreCase(existingScroll.getScrollName()) && scrollRepository.findScrollByScrollNameIgnoreCase(scrollName) != null) {
            return "Scroll name already exists";
        } else if (!scrollName.matches("[a-zA-Z0-9 ]*")) {
            return "Scroll name must only contain letters, numbers, and spaces";
        } else {
            existingScroll.setScrollName(scrollName);
        }

        // Scroll Description validation
        if (scrollDescription.length() > 70) {
            return "Scroll description must be less than 70 characters";
        } else if (!scrollDescription.matches("[a-zA-Z0-9 ]*")) {
            return "Scroll description must only contain letters, numbers, and spaces";
        } else {
            existingScroll.setScrollDescription(scrollDescription);
        }

        // Scroll Content validation
        if (scrollContent.length() > 2000) {
            return "Scroll content must be less than 1000 characters";
        } else if (!scrollContent.matches("[01]*")) {
            return "Scroll content must only contain 0 and 1";
        } else {
            existingScroll.setScrollContent(scrollContent);
        }

        // Setting other details
        existingScroll.setLastModified(new java.util.Date());

        // Save updated scroll to the database
        scrollRepository.save(existingScroll);

        // Assuming the user details are updated in a similar manner
        // If not, you may remove this
        Query query = new Query(Criteria.where("userName").is(userName));
        Update update = new Update();
        update.push("uploadScrollIds", scrollId);
        UpdateResult result = mongoTemplate.updateFirst(query, update, User.class);

        if (result == null) {
            System.out.println("No user documents updated");
            return "No user documents updated";
        } else {
            System.out.println(result.getModifiedCount() + " user document(s) updated.");
            return "success";
        }
    }
=======
    public String updateScroll(String userRole, String userName, String scrollName, String scrollDescription, String scrollContent, int scrollId) {
        Scroll scroll = scrollRepository.findScrollByScrollId(scrollId);
        if (scroll == null) {
            return "Scroll does not exist";
        } else if (!scroll.getUploadUserName().equals(userName) && !userRole.equals("admin")) {
            return "You do not have permission to update this scroll";
        } else {
            if (scrollDescription.length() > 150) {
                return "Scroll description must be less than 150 characters";
            } else if (!scrollDescription.matches("[a-zA-Z0-9 ,.'/:;@!$%&()-*?\"]*")) {
                return "Scroll description must only contain letters, numbers, and spaces";
            } else if (!scrollDescription.matches(".*[a-zA-Z].*")) {
                return "Scroll description must contain at least one alphabet letter";
            } else {
                scroll.setScrollDescription(scrollDescription);
            }

            if (scrollContent.length() > 2000) {
                return "Scroll content must be less than 2000 characters";
            } else if (!scrollContent.matches("[01]*")) {
                return "Scroll content must only contain 0 and 1";
            } else {
                scroll.setScrollContent(scrollContent);
            }
            scroll.setScrollName(scrollName);
            scroll.setLastModified(new java.util.Date());
            scrollRepository.save(scroll);
            return "success";
        }
    }

    public String deleteScroll(String userRole, String userName, int scrollId) {
        Scroll scroll = scrollRepository.findScrollByScrollId(scrollId);
        if (scroll == null) {
            return "Scroll does not exist";
        } else if (!scroll.getUploadUserName().equals(userName) && !userRole.equals("admin")) {
            return "You do not have permission to delete this scroll";
        } else {
            Query query = new Query(Criteria.where("userName").is(scroll.getUploadUserName()));
            Update update = new Update();
            update.pull("uploadScrollIds", scrollId);
            UpdateResult result = mongoTemplate.updateFirst(query, update, User.class);
            if (result == null) {
                System.out.println("No documents updated");
                return "No documents updated";
            } else {
                scrollRepository.delete(scroll);
                System.out.println(result.getModifiedCount() + " document(s) updated..");
                return "success";
            }
        }
    }

    public String toggleLikeScroll(String userName, int scrollId) {
        Scroll scroll = scrollRepository.findScrollByScrollId(scrollId);
        if (scroll == null) {
            return "Scroll does not exist";
        } else {
            User user = userService.getByUserName(userName);
            if (user.getLikeScrollIds() == null || !user.getLikeScrollIds().contains(scrollId)) {
                Query query = new Query(Criteria.where("userName").is(userName));
                Update update = new Update();
                update.push("likeScrollIds", scrollId);
                UpdateResult result = mongoTemplate.updateFirst(query, update, User.class);
                if (result == null) {
                    System.out.println("No documents updated");
                    return "No documents updated";
                } else {
                    scroll.setLikes(scroll.getLikes() + 1);
                    userService.likeReceived(scroll.getUploadUserId());
                    scrollRepository.save(scroll);
                    System.out.println(result.getModifiedCount() + " document(s) updated..");
                    return "success";
                }
            } else {
                Query query = new Query(Criteria.where("userName").is(userName));
                Update update = new Update();
                update.pull("likeScrollIds", scrollId);
                UpdateResult result = mongoTemplate.updateFirst(query, update, User.class);
                if (result == null) {
                    System.out.println("No documents updated");
                    return "No documents updated";
                } else {
                    scroll.setLikes(scroll.getLikes() - 1);
                    userService.likeReceivedCancel(scroll.getUploadUserId());
                    scrollRepository.save(scroll);
                    System.out.println(result.getModifiedCount() + " document(s) updated..");
                    return "success";
                }
            }
        }
    }
>>>>>>> bb4eb17cd8c172aa8125a914854a40ffbe1d85ce
}
