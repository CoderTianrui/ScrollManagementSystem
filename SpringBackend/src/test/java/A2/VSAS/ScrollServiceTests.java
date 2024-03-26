package A2.VSAS;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class ScrollServiceTests {


    @MockBean
    private ScrollRepository scrollRepository;

    @Autowired
    private ScrollService scrollService;

    @Test
    public void getByScrollId() {
        Scroll scroll = new Scroll();
        Mockito.when(scrollRepository.findScrollByScrollId(0)).thenReturn(scroll);
        Scroll result = scrollService.getByScrollId(0);
        System.out.println("getByScrollId:" + result.toString());
        assertNotNull(result);
    }

    @Test
    public void allScrolls() {
        List<Scroll> scrolls = scrollService.allScrolls();
        assertNotNull(scrolls);
    }

    @Test
    public void getScrollsByScrollName() {
        List<Scroll> scrolls = scrollService.getScrollsByScrollName("Avada Kedavra");
        assertNotNull(scrolls);
    }

    @Test
    public void getScrollsByUploaderName() {
        List<Scroll> scrolls = scrollService.getScrollsByUploaderName("admin");
        assertNotNull(scrolls);
    }

    @Test
    public void sortByDownloads() {
        List<Scroll> scrolls = scrollService.allScrolls();
        scrolls = scrollService.sortByDownloads(scrolls);
        assertNotNull(scrolls);
    }

    @Test
    public void sortByLikes() {
        List<Scroll> scrolls = scrollService.allScrolls();
        scrolls = scrollService.sortByLikes(scrolls);
        assertNotNull(scrolls);
    }

    @Test
    public void sortByUploadDate() {
        List<Scroll> scrolls = scrollService.allScrolls();
        scrolls = scrollService.sortByUploadDate(scrolls);
        assertNotNull(scrolls);
    }

    @Test
    public void sortByLastModified() {
        List<Scroll> scrolls = scrollService.allScrolls();
        scrolls = scrollService.sortByLastModified(scrolls);
        assertNotNull(scrolls);
    }

}
