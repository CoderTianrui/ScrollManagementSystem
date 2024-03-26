package A2.VSAS;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScrollRepository extends MongoRepository<Scroll, ObjectId> {
    Scroll findScrollByScrollId(int ScrollId);

    List<Scroll> findByScrollNameContainsIgnoreCase(String scrollName);

    List<Scroll> findByUploadUserNameContainsIgnoreCase(String uploadUserName);

    Scroll findScrollByScrollNameIgnoreCase(String scrollName);
}
