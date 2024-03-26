package A2.VSAS;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.List;

@Document(collection = "Users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    private ObjectId id;
    private int userId;
    private String userName;
    private String password;
    private String avatar;
    private String email;
    private String phone;
    private String firstName;
    private String lastName;
    private int likesReceived;
    private String role;
    private List<Integer> uploadScrollIds;
    private List<Integer> downloadScrollIds;
    private List<Integer> likeScrollIds;
    private boolean loggedIn;
}
