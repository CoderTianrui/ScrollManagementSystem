
package A2.VSAS;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "Scrolls")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Scroll {
    @Id
    private ObjectId id;
    private int scrollId;
    private String scrollName;
    private String scrollDescription;
    private String scrollContent;
    private int likes;
    private int downloads;
    private String uploadUserName;
    private int uploadUserId;
    private Date uploadDate;
    private Date lastModified;
}
