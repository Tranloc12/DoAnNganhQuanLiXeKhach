package com.nhom12.configs;

import com.paypal.base.rest.APIContext;
// Không cần import OAuthTokenCredential nữa
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class PaypalConfig {

    private String clientId = "ATIqBPrG29ClBGi81HjlLae_BoT02Z5O63QyQSJhCa0OUDfv_UdEeCmnT_je-iayM9DNJqCP9yAREExH";
    private String clientSecret = "EMxi8bjNCx4QSuUQQY5EJswbfyWMb2Q5vm6YmLlAw9CN6S6qP_efM5GkdkiRS4J7GKzGCP-1j_gbnWNr";
    private String mode = "sandbox"; // Chế độ môi trường: "sandbox" để thử nghiệm

    @Bean
    public APIContext apiContext() {
        // Khởi tạo APIContext trực tiếp bằng Client ID, Secret Key và mode.
        // Đây là cách được khuyến nghị và không bị deprecated trong SDK 1.14.0.
        APIContext apiContext = new APIContext(clientId, clientSecret, mode);
        
        // Không cần cấu hình Map riêng nếu mode đã được truyền vào constructor.
        // Tuy nhiên, nếu bạn có các cấu hình SDK khác, bạn vẫn có thể giữ lại paypalSdkConfig()
        // và thiết lập chúng sau khi khởi tạo apiContext.
        // apiContext.setConfigurationMap(paypalSdkConfig()); // Có thể bỏ dòng này nếu mode là cấu hình duy nhất
        return apiContext;
    }

    // Phương thức này có thể không cần thiết nếu mode là cấu hình duy nhất được sử dụng
    // khi khởi tạo APIContext trực tiếp.
    private Map<String, String> paypalSdkConfig() {
        Map<String, String> sdkConfig = new HashMap<>();
        sdkConfig.put("mode", mode);
        return sdkConfig;
    }
}
