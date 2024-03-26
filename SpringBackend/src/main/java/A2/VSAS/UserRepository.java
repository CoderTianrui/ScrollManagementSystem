package A2.VSAS;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, ObjectId> {
    User findUserByUserNameIgnoreCase(String UserName);

    User findUserByEmailIgnoreCase(String Email);

    User findUserByUserId(int UserId);

    List<Integer> getUploadScrollIdsByUserId(int UserId);
}
