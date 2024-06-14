import com.shephertz.app42.server.idomain.BaseServerAdaptor;
import com.shephertz.app42.server.idomain.IZone;
import com.shephertz.app42.server.idomain.IRoom;
public class serverAdaptor extends BaseServerAdaptor {
    public serverAdaptor() {
        System.out.println("Server Adaptor created");
    }
    public void onZoneCreated(IZone zone) {
        System.out.println("Zone Created");
        zone.setAdaptor(new zoneAdaptor());
        IRoom room = zone.createRoom("room1", 120, null);
        room.setAdaptor(new roomAdaptor());
        System.out.println("Room Created");
    }
    public void onZoneDeleted(IZone zone) {
        System.out.println("Zone Deleted");
    }

}