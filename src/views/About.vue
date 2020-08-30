<template>
  <div class="about">
    <v-container>
      <v-row justify="center" align="stretch">
        <v-col md="10" sm="12" lg="8">
          <v-card>
            <v-card-title>
              <h2>About</h2>
            </v-card-title>
            <v-divider />

            <!-- Content -->
            <v-card-text>
              <div class="content-group">
                <h3 class="my-2">Why does this exist?</h3>
                <p class="text-justify">
                  When Covid started eating up all of my trips, I decided to dive into web development
                  in the (not so unlikely) event I got a WARN notice. I've had a seniority exploration project
                  up and running for a while, but it was mostly just for learning Python and the Flask framework.
                  With the time I had available, I figured it would be useful to learn how to build single page
                  web applications that were designed with our company iPads in mind.
                </p>
              </div>

              <div class="content-group">
                <h3 class="my-2">Who are you?</h3>
                <p class="text-justify">I'm Michael Dempsey. I'm a BOS A320 F/O.</p>
              </div>

              <div class="content-group">
                <h3 class="my-2">I Wish This Did Something it Doesn't Do!</h3>
                <p class="text-justify">
                  Me too! But, why don't you let me know and I'll see if it's an easy enough feature to rig up.
                  And if you think you know how you'd do it, see below.
                </p>
              </div>

              <div class="content-group">
                <h3 class="my-2">Can I Contribute?</h3>
                <p class="text-justify">
                  Please do! I know just shy of nothing about design and I don't really have a clear idea about what
                  kinds of features most line pilots would be interested in. So if you know VueJS, Typescript, SASS, Firebase,
                  Vuetify, or any other things in the stack, I'd happily take on any pull requests here
                  <a
                    href="https://github.com/AirbusDriver/SeniorityVue"
                  >
                    <v-icon>mdi-github</v-icon>
                  </a>.
                </p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>