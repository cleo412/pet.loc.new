<template>
  <Carousel :wrap-around="true">
    <Slide
      class="carousel__box"
      v-for="slide in slides"
      :key="slide">

      <h1>{{ slide["title"] }}</h1>
      <img class="carousel__item"
           :src="slide['slide']"
           :alt="slide['title'] ">

      <table class="carousel__table">
        <tr>
          <td class="carousel__cell">Адрес:</td>
          <td class="carousel__cell">{{ slide["address"] }}</td>
        </tr>
        <tr>
          <td class="carousel__cell">Пн-Пт:</td>
          <td class="carousel__cell">{{ slide["weekdays"] }}</td>
        </tr>
        <tr>
          <td class="carousel__cell">Сб-Вс:</td>
          <td class="carousel__cell">{{ slide["weekends"] }}</td>
        </tr>
        <tr>
          <td class="carousel__cell">Телефон:</td>
          <td class="carousel__cell">{{ slide["phone"] }}</td>
        </tr>
        <tr>
          <td class="carousel__cell">Сайт:</td>
          <td class="carousel__cell">{{ slide["site"] }}</td>
        </tr>
      </table>

    </Slide>

    <template #addons>
      <Navigation />
    </template>

  </Carousel>
</template>

<script>
// https://ismail9k.github.io/vue3-carousel/getting-started.html
import { defineComponent } from "vue";
import { Carousel, Navigation, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

import { useEmplStore } from "@/stores/EmplStore";
import { mapState } from "pinia";

export default defineComponent({
  name: "WrapAround",
  components: { Carousel, Slide, Navigation },

  data() {
    return {
      slides: [
        {
          slide: "",
          title: "Pinzeria by Bontempi на Кропоткинской",
          address: "г. Москва, Волхонка 16",
          weekdays: "11:00 — 23:00 , кухня 11:00 — 22:30",
          weekends: "11:00 - 23:45 , кухня 11:00 — 23:30",
          phone: " 499 678-30-09",
          site: "https://pinzeria.ru/delivery/cropot"
        },
        {
          slide: "",
          title: "Pinzeria by Bontempi на Шлюзовой",
          address: "г. Москва, Шлюзовая набережная, 4",
          weekdays: "12:00 — 23:00 , кухня 11:00 — 22:30",
          weekends: "12:00 - 23:45 , кухня 11:00 — 23:30",
          phone: " 495 201-75-50",
          site: "https://pinzeria.ru/delivery/shluz"
        },
        {
          slide: "",
          title: "Pinzeria by Bontempi на Усачева",
          address: "г. Москва, ул. Усачева, д. 26",
          weekdays: "10:00 — 22:00, кухня до 21:30",
          weekends: "10:00 - 23:00 , кухня 11:00 — 22:00",
          phone: " 499  495 201-74-40",
          site: "https://pinzeria.ru/delivery/usaheva"
        }
      ]
    };
  },

  created() {
    this.setSlidesLink();
  },

  computed: {
    ...mapState(useEmplStore, ["getKeyInStoreEmpl"])
  },

  methods: {
    setSlidesLink() {
      try {
        this.slides.map((elem, index) =>
          elem.slide = this.getKeyInStoreEmpl("imageUrl") + `cafe${index + 1}.jpeg`);
      } catch (error) {
        this.message = `Ошибка  ${error}`;
      }
    }
  }
});
</script>

<style>
.carousel__box {
  display: flex;
  flex-direction: column;
  background-color: var(--vt-c-active-2);
  border-radius: 8px;
  padding: 0;
}

.carousel__item {
  width: 100%;
  min-height: 400px;
  border-radius: 8px;
  padding: 0 25px;
}

.carousel__prev,
.carousel__next {
  top: 45%;
  border: 5px solid var(--vt-c-white);
}

.carousel__icon {
  fill: var(--vt-c-white);
}

.carousel__table {
  padding: 10px;
  margin: 0 auto;
}

.carousel__cell {
  text-align: start;
  padding: 10px;
}

@media screen and (max-width: 425px) {
  .carousel__box {
    font-size: 0.6rem;
  }
}

</style>
