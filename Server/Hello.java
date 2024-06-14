import com.shephertz.app42.server.AppConfig;
import com.shephertz.app42.server.AppWarpServer;


public class Hello {
    public static void main(String[] args){
        System.out.println(AppConfig.TICK_INTERVAL);
        boolean response = AppWarpServer.start(new serverAdaptor(),"hello.json");
        System.out.println(AppConfig.TICK_INTERVAL);
        System.out.println(AppConfig.ListenPort);
        System.out.println(response);
    }

}
