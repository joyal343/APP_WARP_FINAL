//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

import java.util.ArrayList;
import java.util.HashMap;
import com.shephertz.app42.server.idomain.IUser;
import com.shephertz.app42.server.idomain.HandlingResult;
import com.shephertz.app42.server.idomain.BaseRoomAdaptor ;
public class roomAdaptor extends BaseRoomAdaptor{
    public roomAdaptor() {
    }

    public void handleChatRequest(IUser sender, String message, HandlingResult result) {
    }

    public void handleUpdatePeersRequest(IUser sender, byte[] update, HandlingResult result) {
    }

    public void onUserLeaveRequest(IUser user) {
    }

    public void handleUserJoinRequest(IUser user, HandlingResult result) {
        System.out.println("USER JOINED THE ROOM");
        System.out.println(user.getName());
        result.code=0;
    }

    public void onTimerTick(long time) {

    }

    public void handlePropertyChangeRequest(IUser sender, HashMap<String, Object> addOrUpdateMap, ArrayList<String> removeKeysList, HandlingResult result) {
    }

    public void handleLockPropertiesRequest(IUser sender, HashMap<String, Object> locksToUpdate, HandlingResult result) {
    }

    public void onUnlockPropertiesRequest(IUser sender, ArrayList<String> unlockKeysList) {
    }

    public void handleUserSubscribeRequest(IUser sender, HandlingResult result) {
    }

    public void onUserUnsubscribeRequest(IUser sender) {
    }
}
