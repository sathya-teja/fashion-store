import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Heart, Eye, Tag, Search } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/products?featured=true&limit=8"
        );
        setProducts(data.products || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load featured products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const q = (searchQuery || "").trim().toLowerCase();
    if (!q) return true;
    return (
      p.name?.toLowerCase().includes(q) ||
      p.gender?.toLowerCase().includes(q) ||
      p.type?.toLowerCase().includes(q) ||
      p.style?.toLowerCase().includes(q) ||
      p.season?.toLowerCase().includes(q)
    );
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
  };

  const heroSlides = [
    {
      id: "h1",
      img: "https://images.unsplash.com/photo-1521334884684-d80222895322?w=1600",
      heading: "Discover Your Fashion Style",
      sub: "Trendy outfits and timeless classics at your fingertips.",
    },
    {
      id: "h2",
      img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8PEA8PEA8PDw8PEA4PEBUPDg8QFRUQFRUWFhURFRUYHSggGBolGxYVIzEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGhAQGi0lHyUtLS0tLS0tLSstKy0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAMIBAwMBEQACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAAAQIGAwQFBwj/xAA/EAABBAAEAwUECAQFBQEAAAABAAIDEQQSITEFBkETIlFhkTJxgaEUI1KxwdHh8AdCcrJiY4Ki8UNzksLiM//EABsBAQEAAwEBAQAAAAAAAAAAAAABAwQFAgYH/8QAMxEBAAICAQMCBAQFAwUAAAAAAAECAxEEEiExBUEiUWFxEzKRsQYUI6HBFVKBYtHh8PH/2gAMAwEAAhEDEQA/AKQFzZfoSQUVKkDRQihBIKCYRUgFFSQCBooQSAQNEFIBAqQJFCARAqEgEAiBAkAgSBEKhUiIkIIUqjCFETCCSKEUFBIBBNoUVIBRUggkgSKaBgIJIBECAQJAIEgSAVAgEAgEQkAgECQIqiJREUGAI8pBFNA0U6UCkeGgk9FYjbDmzfhV24s3G32Q1raHmbWaMUe7g5/VcvVqrewPF2v0fTDW92PXovFsevDa4vqm+2R043A6ggjy1WN2q2i0bhNR6CKdIGAgkgAgECpAIgQJAkAqBAkAgEAgEQkCVAgiUEUGAI8GimimFBMBByuKyEksB2bf79QsuOPdwPVss9fR9D4RwAzkRtNuOXTwsXZVvkcqmPbrv5Unw1dtDcRy29muWzQJ8B5rHNpnvD3FNIRRsje+Njg5mkjCNO64kEfAt+aW793e9Ly7rNPkzheHVSRQEEgEUFABEOkAgSISAQJAKhIEgEAiBFCARCQJUIoIoNZHhK0UWgk1RU1BxuKsPatoe0B6jp8lmxz8MvnfVqT+NE/OF75Uwf0ZrZTC+XtC2uzDn6uNC/ADx2C8a6pakarVdsfxOEYe8Q0xtkqIh2mt6N1rxXrW+zz2id7eT/RxHNMxpBZG9wYdLyv7wF9RVLxM9nW9Lxz+Ja3tEaZ2ry7e0HYmMWC9ocBYDjV+QViJlqZebip2idyz8Mw0sjA9+RgcXZBepANKzGmpHqFqW6csMj20a8F5dTHeL16oYyjIYCBqISoECKBIEiBAiqBAkAiBFCAQJEJAiqIoNS0YzBQMFF2mCj0nagwYs6A5Q6nA63pehcK6146L1VzvUcPVSLx5j9noXI+NDYTmumAk7nQanQLzHlx7R2dLhnF4pi9omZLQc8js3xuFkbh2laL1O47k0+cPP+ISh80zxs6Rx08Nh8gF43t9HxsUY8cRDRH1knZ/yii7xPkP31XqNRG3K9RzWnJ+HE9lnHIoxEYeCWnwGt+VleqzLlXpEKhxngU+Fc0l0gMbqjJ0Onh5L3F++pXJN7Vjc714daORz2Nc72tj7x+t+iwT5d30q8zjms+wR1jCiGgSBKgKIiUUkQIEVQIEgEQIBFCBIhFAFBFUaNqsIBRdmCipNcou0w5F3ENmLh88rSY4nuaCGl2Q5QfAleumdb12afL5OOlJr1RufEOxw8YnB1cTpGHQ5RZ9xHUea8bcOGfivFDFEGRROh7UUS5ziQ37LbJrqrMzLocPFGW27T49lfYL6ge9NOnmy/h023uVOEvldJIKc9rtA62h1dLrTZXW+z5zJebWm0+6/YLizoYyZ2HDhuUOzOBAJ2FjRetdLF2tG3C5vxrZXsjFESCz1sWKKxTPxMsU+FxMWwMZG3qczvUkj71HY9Mpqsy1EdUwiGgRQJUCBFAkCRCQCoRQCAQCARCQJAKiKDm5l6YBmQ2YchtIOUXa7fwzwxfMXiwGHvkdRXdb7rJJHkF0eFWOmbPnPXcs9Vae2tvXWQNr5ra2+fYn8Mw7ruNovfL3fkFgtx6T7M1c9492CTgOFcCHQskBFHtBn08KOitMFK+y/wA1l3uLa+3ZVuaORMP2E02FjLJmNLw1rnZXBurmhp0Bq6qtViy8eupmsal0ON6nmm0Uyzuv91Y5EnPZksIdJbiQ4myb9dqXPiW3mr02mJWHDzMd2va5iwl5LJYmkAncZwSHN8ARau+mdwxzTcaVGUMfiZHxspjWljAygAB/NXvv5LH57tqcU1rXfu1uISZnNN33Getao7XEp0019ZapRtJBESUESgSoECKBIEiBUJAigEAgEAiEgSAVEUHKtemrssypsw5DZgqLt6PyDx3BYRjYpy+AvIJkew9mXHxcCco99BdHDnx1pFfd8nzseXPmnJHePb7PQcXxBrJmx9oGl1FpOxFDS9taW5EdnN6ZdBkv2hXgei86eWe15Eb1I6UbSfCw8Ddg5cPi8W2KRsTIp5GsfmGUsDjl191aLkXiImYh9HS1s8xNazMzEfsy8S4tiZBldiBIKolsbmem3rS8RTfl2+J6ZMfFljX0c7DZmHuOezSu64t08NOi9upPGxT2msMjX+K8TX5PNsPT+VNeGJJqBqICikiEqEUCQJECoSBIBAIBAIhIEgSoSDjWvbTIuRNgOQiWXDtzOa3xcAjFnv04509M4fHGyIl7WkBv81fivNe86ce3Z1eWZ3SQt7SEOLQWPa1zCWZXFoYWP0oVVg/Dx7eKJikQ4+fU3mYlZ8I5jdGOMd/9ORpDT/SDp6Fe5hgdNg+Hldj4FeBzuMvrJdUTXyPr0WtyvyQ2uLG7S8V5mw5ZjZvsudmH+oXp8bXPrL7r03viraPs02O6L06u2SgbvroopcNYZpmwWA4uAJ8AdS70tSZ1DUycuuOtt+YWbi3LD4u9CXSM8Cbd+qxTtyOP6jFu2XtPzcEgg0dCN70UdKJie8GilaKSISoECQJEJUCBFAIBAIEUQIEgSoSDhFyyNCZRLldPMyWZNJt0uXgDiI72teb/AJWvybdoj6rlzrJ2OG7p0mLY/dpZ+QKx17ywYI3fv7NflDmWaIAvyOaZBbpC0agBpN3mDiAL0N5fErfxcqYnVvDS5vDxzaeje/k9N4bx3D4gNyususAVeo0NEEgrdplrf8rlZOPkx+YdvDkdPTb5dF6lhafHmXC49WU703+VrX5Fd45bHFnWSPq8m56jGeOUbuaWu947zf8A2XKpPd9j6TkmOqk/dXBqbHUWsr6CGUeenzBUDDdQ7Vrh7LgdR+/BebR2a3Iw1yV7wtHBebHRjs8SMzNs7R/cOi8RL5/k8CY71dzGYHDY1mdhF13XNIv9Qkw1cOfJgnt4+Sn8S4dLh3U8adHDY/kfJeXd4/Jpmjt5+TTRskiEqEUAgRRCQCoSAQCARCQCBIEqEgrxKyuZtAlV4mSBRNt/g0uWZh814v4Yc/iJXLnp14OI/wCaw/7XLHj8vGGdXV3lpskjjG2Iy2WgU3MAQQddDXvpZYw2tPwww5rRjn4pevcq8DaxrZXuuUtyhhZWUg6gZtfShvS6PHwfh958uRyeT1/BHhaoTWh/tcPvWxLTYOMS1BMRuI3kaA9D4rHk/JP2ZcMfHH3eT86H6mPxL9P/ABK4tPzPrvTO2WftKq4Q5mgdR8lmfQYrxNNy2IxXwJH4JLLWdxuGRRZhJpWKY01LV6Z0yYWeSE5onmM9QNWn3t/JRp5eJjyfSVgg5jdK3s5YQ91O0AzB4AJ08DonlysvEvhncfq4snZSNMsGbIDleHA2xx2+CTGnR4vIm/w38/uwV16I3N+zah9kV/qPnZuz7su+i9QwX31d2pNVmttNvHr81JZqb6e6Cj0SARAqEgEAgEQkAgSoSBIK0SszkzKJKPEyVqptlw8mVzT4EKTDzfvWV95hHa8LzjUxmJ3zAP3rBTtbTBSdWh0v4U4ZnYOfYa8yblubWtL6DSgPiuzxY1RyvUrTOR6SzDSj+YObv3AIj8gQfks8y522Z0VbSvafsyuLh63fzUXbncykfRJjmLaYDbJNzmHdFam9q86WLN+SWXDP9SPu8y54JEeH833/ALT+a41I7vq/T51k2ruGpp0FijZoaab3+9CFmdfHbvLYEgbmNX33D5/8o2azvVWZlVfu6A7gHr+Hkos2mbHHVXV+h+8fuwvNo7PGaNsuQX8L+dLG1uqdJxE20tppJsE5QAR4mtkhjzRulolsw43I0tbGxpzOL6stfobsHe7N+GlK7alOJrvM/wDiWpmBstaQLdTdDp3dNvwUbupjtMouA72g26V9k/kqu/BZRoNOnQHqAhudbRIBo/l56ae75osTMbgTAD9APXTpXj/ykpMzLCvLIRVAgEAgSIECVAgSBIKwSszjbRJVeNkibFom3oHKGMzx9k4B7XDKQaINjY30KwWjUsHlotmGDmeyB8kUOLaXQPje5pY40XNdRtxaW1rehXV4V4mNWcb1CtotuFh4ZxvijJAxs5y5XAh7mTtu/bc5w0I0oA9dVu/hxM9nO/EmPKxO5sxcLC6RrSwXmectCqskNLdNeitscRGyuSbTqHOj5ofjHvYe+2FrTI9oLIi93shgJJO16k9PFcbk2vPnt9He4uPHG+nvPzUjm/ihlxDI/wCVjSdPtH8gPmtfH427XD+G/wDw58Ehr9Bfqvbs46RPdkY/dvQa/FIbFYjrbMU1fv8AFHuaxLKJTdje72G/iok0rMaZI5swDgdxXTa/3qsU9mn019u6Wc6eV9B13UXpgF5+/oOqbTphFriP1AKLMRILzr57qp0wXaG78NNgh0QWY0B4bKHTHkOedvjsFdp0wiTaLEajRIoQCAQJECBKgQJAkFVtZ3D2SrxsrRBaJt1eC8SMJBHtNIc3Xq0g18QCPiFjtV413dj6MzEYgPD3ugBfPG0UezdIe83Iboh16Vroujw9THhx/UItFo3PZbYY2GjbA4AZe6GU06gFoFj0XTruHHtEe7XxlmF4LWZ2tdZL3O0HiatTLuKTMeXrF0zeImezl8A4hEbw7RmzuugHDvHdxLiTem7gABtrS4M48ua3eH0sZMOCnaeyqYx+aQu8XvG96G9L+CxRGuzt1iPgmG3CNFXZxR2SiPePmi0n4pbUMTnOaxosmuoAAPUk6NHmV7x47XnVWLmc7DxKdWW32j3n7R/7DuDg8ZieH1IXNdteUHwHj8/gupj4dK1nfeXw3O9ez8rJER8NN+I9/vP+PDmN8tlwX3Ea12NFBRCQCBIEgSIECVAgEAgEQIEqBAkCQVRbDgzKKMexauk2Vpo2LQ2tvLkwIjvNZa9h7tsIGV3eO4dpvXVdHjREVhwudNpyamVyw7hkDdTWorvD3DKfet6HMmNOTxPCZ3CGVsbCWZwZHOtzsxDWHvUO6CdbK8z8UrWZrHZl4bhmYeKV4j7ORkb3h9kgANLgb2d0H4KZNUpMx8mTBvJlrWe+5hQnW7rZvMSTuetr56JfezXcREezpYCN0hLWt20JJAH5rZxca2SNw85/XcHGmcdqzMx8mWfhz22e0Y2gT3TroCdz7ltV4MR3tLicj+JMt51hr0/XzLf5cEJka3PGXnYFxcbPyvzK2qRWsahwc18uW03vuZ+crbicJbc2hIB0JrYfis0Wa81VGbR7xVU949CQvmssRF7RHzfp3FtNsFJt56Y/YljbAQCAQJBEoBEIqgQCAQCARAgSoECQJBVCVsPn9oKvBIkhECC18pi8PN/hkBBomiW6X4A1v71v8T8suP6j2vE/RaeF2QJDo5vjdg+/qLC34cqWbENDpJnyEvhdkAGUuyBoslxI2JLvTdSNb0k77NLmSRsWEl7P2HjK2nl25awiz0r52sHKtrFLe9Np1cmv6/ookZXEl9rSXc5ak+sc3yvx6an7l1OHPwPlfV4j+YtP2/Z2uKYYghrgQHN66bjSh8bW7afhlya1+OI+rg4J3ZTRuA7rtDQFgtFgjzXL4OTzWX03r3FrWa5Kx9J/w9DblkgLg6yRYBFe8eA/RdOJ7vl5hSMQKkf/AFO+9fP8iNZbfd+kcC0W42OY/wBsfsAVhbgQJFNEIoIoBEJUJA0AgEQIBAlQIEgSCpLYfOkVUJECIEVYuUOJugc/LA2bNWbNIY+71bdHT4LLjz/hezT5XGjNrvpbMJPlD5MgDiTTe4Moy1lDsu2bW68ll/1GPlLT/wBMt/uj9GbDcReczQ+o3gUwgU3u13XgB3z67LX/AJ3J1TP9mzHp+KaxH91c5u40ZHHDhjAGhtkOcbFh1UdtQF6vybZK6mGxw+DXDfriZlXolrS7NHc5bnDJ6P8AOK2B1W9wrT3hw/XMUbrePKz8QaDQJzDO09Nsw0vounPeupfOVtNbRaPMKriBQvcMdfwH6Lg8e0Uy/wBn3vqeG2bhzrz2n/utPAcYHRZc3dA65vDWl26S+FvVyeJsqQkbOAcNb8t+u3zXI59NZZn59323oOb8TiRXX5ZmP8/5YAtJ2jQRKAtAigEAiEqEgEAgaIEAgSoECQJBUlsPnEVUCIEAirbyhw8Pa4n+bb8FhyS877tvmOR+Hhy57c89myvPc/AfeFMcblbS7PL2GD4mh41ACk+Xnan83xBmLeBoMsdei918NjDPZzYiktyjewchbJGW0DmoXttsR1WzxZ+JzvWI/pVnXutOImL2hjswtzcp7MMb0NVuupvdZh8zGq3rP1hxw1fPd4fpPaYdXl7GOGdpMvdOX/8AaEgihRyPHn4rt4LzesS/PudhjDmtT5T8mTjMNUfB32QDThetadAsPqNd1rb/AIdX+G8usl8fzjf6f/XLC5D65IlAkUigSACIECQCoEQIBA0CQCoECQCCoFbL5wiq8SEUKEBVXovKUVRt9y17eXj2cTnqcGaBv2Wl3q7/AOV7x+BcuAuBYwjqAsc+XmVG51eDjZPJsY+V/islfDPhns5MZSW9SW7hdXM1rvNF5stXpd9Fl48/1Ihrep1m3GmY9u61PxEhaGvdn0Ba7qOuVxO5H4Ls1jt3fG21vcOXIe87+p33r57JGrz936Txp3hpP0j9k8DYe41YIGwsg/lounwZ3T7Pk/4gp08iJ+cfs7HEDcL9iQW6jrThr7t/VZ+bG8EtX0O3Tza/Xcf2cMOXCfepZlFAKAtEFoAFUFoEgEQIGgEAqBAIBAkAgqBWzD5yUSqxyYRYMKPUQaPT0vlttQNP+Fa8sUqLzBie1xErrsB2Rvubp99lZaxqGSI7L9yhLnhZ5NWO3lilROZpM2MxB/x16AD8FliOzJjlpxuUblJZ82hu9dNPNXHEzeNLyb1rgtNvGlhw0kmQEPJbsWvYBoQdQ4E9a0K7kb0+HtqZ8MMjrc4jYklcLk16ctn6D6Zk6+Ljmflr9OyD8YYacHFrj3QQLrrqOo0Wfg2mLzpzv4hpS2GszHffb/Lfn4izsr7SOyKNeyb3ArrqV08l8dqzWbQ+UwVzY8tclaz2nbTzL5/WpfpUTuIkwVBIIbNDYRdhECAQCoEAgaAQCAQCAQJBUy1bD52YQc1XbHaEQFUhMLyyQz4PCyTPbFEwySPNNa2rJ+OnqvVazM6h5vetKzafZ6rh+WeJw4RuRmFlny6wjEOa+vJxblLh1Fgb6lZZ4k/Ny/5//peUPYRYIIcCQQdDY3BvYrXdrcdO4Xf+GvDsZiwT2n0TAsJa6QMa6WR3VseYFoA6uII6a9NmnGi3eXDy822/hYufuRZMDmxUckmIge92d0keV8ZcdM5GjgSfaAGvRTJh6I3Hhs8blxknpnypbCteXVpZb+TOWfpbhJNHL2FjKGxv+sIIFZtKAJGxs7BZuPim09UtP1DmVrScUd5n+z0wcmYIMoxPiYLpzJ5e8CKoteSWkHp8+i6HVOtPnYrG9vMuYMD9FxDoWm2tZFRO5JYLd8TZ+K5fIr/Unb7T0nJH8tWPv+7nuiD6a8AtzC/zWKu4ns3OTWmTHMWjfv8A8vZeF8FwMuBjw4w7ezyANLnRtmv7WYag34+i6P8AL01rT4mvKy48nXE94/R5fx/hf0TEyQZi5opzC6g7Idg4DqKI8DVjQrQy4+i2n2XC5n8zijJrU+/3abQsTc2mAhtNQ2RRdkouwgFQIoQCBhAIBAIBAIEgreRZ3CmqJiR4miJhROhAxnwV28zWV6/hPgnOmmlyjK1rWZj7WYmyxp6Cqv4Lb4sd5lzfUbR0xV7BxKWOCCSaRjcsUT3k0CQG96h6eoC2bWiO7l0pN7RWPd84TSOlmc5wy9tKXHwGd1n71y/Nn02ppXWvEPTeD4+TAhrQA+MezTqFGl0Ynp7ORbFXJHbsvHDeKMxLKc3RzdWuyuBFUdr00WTzDRtSaSpH8QuQsLFBJjsP9TkyGSIDuFpcGksG7T3hptpsFp58MRHVDqcLmXmei/f5T7uvy/zTguxYwSQtLWhobnDSAPZFH4L3XNGtNK+C822zY3jrHusNz6XoNPIWd1k64mFrgu8+5qzz4gyez3GtonwJ/NaOed22+j9NrNMPTPzcN5ezcWsDf6vm9w5VxUTsLE0UR2YB7u56n11XVraJiHxGWkxefupv8SZiZomB4dGGFwGQAtfdO1q6IrTa7Wpyp3MPoPRKx+HaffapNatR3olPKhs6UXZFR6JF2SLsIbJFCBopoBAIBAIBAIOBlWdxdDKhoAKiWS0Hf5VxeLwxvDCJ9k6Sh++ngVsYbzWNQ5nK40XnvK343jHFZ8NiIp2YVsb4ZGfVslzm2kULefuWa02tWY018WDHTJW2/EvORHRHkQVpOzM7hZoYhKAA2wa20WxHdpzER5drB4V7WZBLPEP8ud7D8CDos0b01MlaTO9OVxnh0DGlxxM00ugaJZ5JjvreZxpYckRry2uNWYt2rps8IxMGUN1a73fivNIqmbFeJ26j2X7JH4rNpgr9Va4qbkPuC1Mv5nY4saxtF0YOhFhY2z7O3wjgjsrXMxGJjFWAyeQD4C9FsVpOnCy1pFp7MfGcMWuFuc817TnOdrvVn96rFljU93R4GorOnOEaxOjs8qLtAhR62iVHqJKlF2SikikihFAQNFCBoBAIBAIOGs7jBUNqDIEeVh5T9t/+n8VnxeWryfC7y+z+/BbbmR5eaY8fXS/9yT+4rnz5dqn5YWPlg/Vu8nfktjH4amby2+ZnERNAJAJF0d/evWb8qcSIm6shajpsuGJDhWmoXqvl5yfllbm+zfU5r9FtuT7qqVo38u3i/Kj1XlklZ+DE5KvSvyW7j8OJm/M5vGCc4/patfN5dLhx/TaJWFusaiouUl6hjKj1BtQlAqPcIlRQgEegEDCARQgaAQCAQf/Z",
      heading: "New Arrivals",
      sub: "Fresh looks dropped this week.",
    },
  ];

  const categories = [
    { name: "Men", img: "https://tse2.mm.bing.net/th/id/OIP.zAcSN38fmio0iJU7ChfT4gHaLH?pid=Api&P=0&h=180" },
    { name: "Women", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5hy3OQDeTwTLjxqjkiTH6Jb8GXOgpcaX4eg&s" },
    { name: "Kids", img: "data:image/jpeg;base64,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" },
    { name: "Accessories", img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
     {/* 🔍 Search bar */}
<div className="sticky top-0 z-30 bg-white  ">
  <div className="max-w-4xl mx-auto px-3 py-2">
    <form onSubmit={handleSearchSubmit} className="flex items-center">
      <div className="flex-1 flex items-center bg-gray-100 rounded-full shadow focus-within:ring-2 focus-within:ring-accent">
        <input
          className="flex-1 px-4 py-2 text-sm bg-transparent outline-none placeholder-gray-500"
          type="search"
          placeholder="Search for products, brands, categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="m-1 h-9 w-9 flex items-center justify-center rounded-full bg-accent text-white hover:bg-accent/90 transition"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </div>
    </form>
  </div>
</div>


   {/* 🌟 Hero Slider */}
<section className="w-full mt-2 md:mt-4">
  <Swiper
    modules={[Pagination, Autoplay]}  // 👈 removed Navigation
    spaceBetween={0}
    slidesPerView={1}
    pagination={{ clickable: true }}
    autoplay={{ delay: 4000 }}
    loop
  >
    {heroSlides.map((s) => (
      <SwiperSlide key={s.id}>
        <div className="relative w-full overflow-hidden md:rounded-xl md:max-w-6xl md:mx-auto shadow">
          <img
            src={s.img}
            alt={s.heading}
            className="w-full h-[40vh] md:h-[60vh] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20 flex items-center justify-center">
            <div className="text-center text-white px-4 md:px-8">
              <h2 className="text-xl md:text-4xl font-bold drop-shadow-md">{s.heading}</h2>
              <p className="mt-2 md:mt-3 text-sm md:text-lg text-gray-200">{s.sub}</p>
              <Link
                to="/shop"
                className="inline-block mt-4 md:mt-6 bg-accent px-5 py-2 rounded-full text-sm md:text-base font-medium shadow hover:opacity-90"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</section>


   {/* 🏷 Categories */}
<section className="max-w-6xl mx-auto px-3 md:px-6 mt-8">
  <h3 className="text-lg font-semibold mb-4">Shop by Category</h3>

  {/* Horizontal Scrollable Row */}
  <div className="flex space-x-8 overflow-x-auto scrollbar-hide pb-3">
    {categories.map((cat) => {
      const filterKey = cat.name === "Accessories" ? "type" : "gender";

      return (
        <Link
          to={`/shop?${filterKey}=${encodeURIComponent(cat.name)}`}
          key={cat.name}
          className="flex flex-col items-center text-center flex-shrink-0 group"
        >
          {/* Circle Image */}
          <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 
                          rounded-full bg-gray-100 flex items-center justify-center 
                          overflow-hidden shadow-sm group-hover:shadow-md transition ">
            <img
              src={cat.img}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* Label */}
          <h4 className="mt-2 text-xs md:text-sm lg:text-base font-medium">
            {cat.name}
          </h4>
        </Link>
      );
    })}
  </div>
</section>





      {/* ⭐ Featured Products */}
      <section className="max-w-6xl mx-auto px-3 md:px-6 mt-10 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Featured Products</h3>
          <Link to="/shop" className="text-sm text-accent">See all</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="bg-white rounded-lg p-4 animate-pulse h-56" />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
            loop
          >
            {filteredProducts.map((product) => (
              <SwiperSlide key={product._id}>
                <div className="bg-white rounded-xl shadow hover:shadow-md transition p-3 relative flex flex-col h-full border border-gray-100">
                  {product.discountPrice && product.discountPrice < product.price && (
                    <span className="absolute top-2 left-2 bg-accent text-white text-[11px] px-2 py-0.5 rounded flex items-center gap-1">
                      <Tag size={12} /> Sale
                    </span>
                  )}

                  <button className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow hover:text-pink-500 transition">
                    <Heart size={14} />
                  </button>

                  <div className="rounded-lg overflow-hidden aspect-[3/4] bg-gray-50 flex items-center justify-center">
                    <img
                      src={product.imageUrl || "https://via.placeholder.com/300x400?text=No+Image"}
                      alt={product.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  <h4 className="mt-3 text-sm font-medium line-clamp-2">{product.name}</h4>
                  {product.discountPrice ? (
                    <p className="text-accent font-semibold text-sm">
                      ₹{product.discountPrice}{" "}
                      <span className="line-through text-gray-400 ml-2">₹{product.price}</span>
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm">₹{product.price}</p>
                  )}

                  <Link
                    to={`/product/${product._id}`}
                    className="mt-3 inline-flex items-center justify-center gap-1 text-xs bg-accent text-white py-2 rounded-md w-full hover:opacity-90"
                  >
                    <Eye size={14} /> View
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>
    </div>
  );
}
