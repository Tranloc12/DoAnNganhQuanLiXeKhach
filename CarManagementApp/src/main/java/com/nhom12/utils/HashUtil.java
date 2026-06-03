import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashUtil {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("123456 matches admin hash: " + encoder.matches("123456", "$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO"));
        System.out.println("admin matches admin hash: " + encoder.matches("admin", "$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO"));
        System.out.println("password matches admin hash: " + encoder.matches("password", "$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO"));
        System.out.println("New hash for 123456: " + encoder.encode("123456"));
    }
}
