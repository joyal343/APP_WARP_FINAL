import com.shephertz.app42.server.idomain.BaseZoneAdaptor;
import com.shephertz.app42.server.idomain.HandlingResult;
import com.shephertz.app42.server.idomain.IUser;

public class zoneAdaptor extends BaseZoneAdaptor {
    public int count = 0;
    public zoneAdaptor() {
        System.out.println("Zone Adaptor created");
    }
    public void handleAddUserRequest(IUser user, String authData, HandlingResult result) {
        System.out.println("User In Zone");
        System.out.println(user.getName());
        System.out.println(authData);
        System.out.println("COUNT OF USERS");
        count++;
        System.out.println(count);
        result.code=0;

    }
}
